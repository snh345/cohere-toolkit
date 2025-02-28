'use client';

import { UseMutateAsyncFunction, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  Citation,
  CohereChatRequest,
  CohereNetworkError,
  Document,
  FinishReason,
  StreamEnd,
  StreamEvent,
  StreamToolCallsGeneration,
  isCohereNetworkError,
  isStreamError,
} from '@/cohere-client';
import {
  BACKGROUND_TOOLS,
  DEFAULT_TYPING_VELOCITY,
  DEPLOYMENT_COHERE_PLATFORM,
  TOOL_PYTHON_INTERPRETER_ID,
} from '@/constants';
import {
  StreamingChatParams,
  useChatRoutes,
  useStreamChat,
  useUpdateConversationTitle,
} from '@/hooks';
import { useCitationsStore, useConversationStore, useFilesStore, useParamsStore } from '@/stores';
import { OutputFiles } from '@/stores/slices/citationsSlice';
import { useStreamingStore } from '@/stores/streaming';
import {
  BotState,
  ChatMessage,
  ErrorMessage,
  FulfilledMessage,
  MessageType,
  createAbortedMessage,
  createErrorMessage,
  createLoadingMessage,
} from '@/types/message';
import {
  createStartEndKey,
  fixInlineCitationsForMarkdown,
  fixMarkdownImagesInText,
  isGroundingOn,
  parsePythonInterpreterToolFields,
  replaceCodeBlockWithIframe,
  replaceTextWithCitations,
  shouldUpdateConversationTitle,
} from '@/utils';

const USER_ERROR_MESSAGE = 'Something went wrong. This has been reported. ';
const ABORT_REASON_USER = 'USER_ABORTED';

type IdToDocument = { [documentId: string]: Document };

type ChatRequestOverrides = Pick<
  CohereChatRequest,
  'temperature' | 'model' | 'preamble' | 'tools' | 'file_ids'
> & {
  isHiddenRegeneration?: boolean; // Special flag for regeneration from flow diagram
  inPlaceUpdate?: boolean; // Flag to indicate regeneration should update the existing message instead of creating a new one
};

// export type HandleSendChat = (
//   {
//     currentMessages,
//     suggestedMessage,
//   }: {
//     currentMessages?: ChatMessage[];
//     suggestedMessage?: string;
//   },
//   overrides?: ChatRequestOverrides
// ) => Promise<void>;
export type HandleSendChat = (
  {
    currentMessages,
    suggestedMessage,
  }: {
    currentMessages?: ChatMessage[];
    suggestedMessage?: string;
  },
  overrides?: ChatRequestOverrides
) => Promise<{ responseText?: string; events?: StreamToolCallsGeneration[] } | undefined>;

export const useChat = (config?: { onSend?: (msg: string) => void }) => {
  const { chatMutation, abortController } = useStreamChat();
  const { mutateAsync: streamChat } = chatMutation;

  const {
    params: { temperature, preamble, tools, model, deployment, deploymentConfig, fileIds },
  } = useParamsStore();
  const {
    conversation: { id, messages },
    setConversation,
    setPendingMessage,
  } = useConversationStore();
  const { mutateAsync: updateConversationTitle } = useUpdateConversationTitle();
  const {
    citations: { outputFiles: savedOutputFiles },
    addSearchResults,
    addCitation,
    saveOutputFiles,
  } = useCitationsStore();
  const {
    files: { composerFiles },
    clearComposerFiles,
    clearUploadingErrors,
  } = useFilesStore();
  const queryClient = useQueryClient();

  const currentConversationId = id || composerFiles[0]?.conversation_id;

  const [userMessage, setUserMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStreamingToolEvents, setIsStreamingToolEvents] = useState(false);
  const { streamingMessage, setStreamingMessage } = useStreamingStore();
  const { agentId } = useChatRoutes();

  useEffect(() => {
    return () => {
      abortController.current?.abort();
      setStreamingMessage(null);
    };
  }, []);

  const saveCitations = (
    generationId: string,
    citations: Citation[],
    documentsMap: {
      [documentId: string]: Document;
    }
  ) => {
    for (const citation of citations) {
      const startEndKey = createStartEndKey(citation.start ?? 0, citation.end ?? 0);
      const documents = (citation?.document_ids || [])
        .map((id) => documentsMap[id])
        // When we use documents for RAG, we don't get the documents split up by snippet
        // and their new ids until the final response. In the future, we will potentially
        // get the snippets in the citation-generation event and we can inject them here.
        .filter(Boolean);
      addCitation(generationId, startEndKey, documents);
    }
  };

  const mapDocuments = (documents: Document[]) => {
    return documents.reduce<{ documentsMap: IdToDocument; outputFilesMap: OutputFiles }>(
      ({ documentsMap, outputFilesMap }, doc) => {
        const docId = doc?.document_id ?? '';
        const toolName = doc?.tool_name ?? '';
        const newOutputFilesMapEntry: OutputFiles = {};

        if (toolName === TOOL_PYTHON_INTERPRETER_ID) {
          const { outputFile } = parsePythonInterpreterToolFields(doc);

          if (outputFile) {
            newOutputFilesMapEntry[outputFile.filename] = {
              name: outputFile.filename,
              data: outputFile.b64_data,
              documentId: docId,
            };
          }
        }
        return {
          documentsMap: { ...documentsMap, [docId]: doc },
          outputFilesMap: { ...outputFilesMap, ...newOutputFilesMapEntry },
        };
      },
      { documentsMap: {}, outputFilesMap: {} }
    );
  };

  const handleUpdateConversationTitle = async (conversationId: string) => {
    const { title } = await updateConversationTitle(conversationId);

    if (!title) return;

    // wait for the side panel to add the new conversation with the animation included
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // iterate each character in the title and add a delay to simulate typing
    for (let i = 0; i < title.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, DEFAULT_TYPING_VELOCITY));
      // only update the conversation name if the user is still on the same conversation
      // usage of window.location instead of router is due of replacing the url through
      // window.history in ConversationsContext.
      if (window?.location.pathname.includes(conversationId)) {
        setConversation({ name: title.slice(0, i + 1) });
      }
    }
  };

  const handleStreamConverse = async ({
    newMessages,
    request,
    headers,
    streamConverse,
    updateInPlace = false,
  }: {
    newMessages: ChatMessage[];
    request: CohereChatRequest;
    headers: Record<string, string>;
    streamConverse: UseMutateAsyncFunction<
      StreamEnd | undefined,
      CohereNetworkError,
      StreamingChatParams,
      unknown
    >;
    updateInPlace?: boolean;
  }) => {
    // If we're updating in place, we don't want to update the messages state yet
    if (!updateInPlace) {
      setConversation({ messages: newMessages });
    }
    const isRAGOn = isGroundingOn(request?.tools || [], request.file_ids || []);
    setStreamingMessage(
      createLoadingMessage({
        text: '',
        isRAGOn,
      })
    );
    
    // Define a result object to return
    let result: { responseText?: string; events?: StreamToolCallsGeneration[] } = {};

    let botResponse = '';
    let conversationId = '';
    let generationId = '';
    let citations: Citation[] = [];
    let documentsMap: IdToDocument = {};
    let outputFiles: OutputFiles = {};
    let toolEvents: StreamToolCallsGeneration[] = [];
    let currentToolEventIndex = 0;

    // Temporarily store the streaming `parameters` partial JSON string for a tool call
    let toolCallParamaterStr = '';

    clearComposerFiles();
    clearUploadingErrors();

    await streamConverse({
      request,
      headers,
      onRead: (eventData) => {
        switch (eventData.event) {
          case StreamEvent.STREAM_START: {
            const data = eventData.data;
            setIsStreaming(true);
            conversationId = data?.conversation_id ?? '';
            generationId = data?.generation_id ?? '';
            break;
          }

          case StreamEvent.TEXT_GENERATION: {
            setIsStreamingToolEvents(false);
            const data = eventData.data;
            botResponse += data?.text ?? '';
            setStreamingMessage({
              type: MessageType.BOT,
              state: BotState.TYPING,
              text: botResponse,
              generationId,
              isRAGOn,
              originalText: botResponse,
              toolEvents,
            });
            break;
          }

          // This event only occurs when we use tools.
          case StreamEvent.SEARCH_RESULTS: {
            const data = eventData.data;
            const documents = data?.documents ?? [];

            const { documentsMap: newDocumentsMap, outputFilesMap: newOutputFilesMap } =
              mapDocuments(documents);
            documentsMap = { ...documentsMap, ...newDocumentsMap };
            outputFiles = { ...outputFiles, ...newOutputFilesMap };
            saveOutputFiles({ ...savedOutputFiles, ...outputFiles });

            toolEvents.push({
              text: '',
              stream_search_results: data,
              tool_calls: [],
            } as StreamToolCallsGeneration);
            currentToolEventIndex += 1;

            break;
          }

          case StreamEvent.TOOL_CALLS_CHUNK: {
            setIsStreamingToolEvents(true);
            const data = eventData.data;

            // Initiate an empty tool event if one doesn't already exist at the current index
            const toolEvent: StreamToolCallsGeneration = toolEvents[currentToolEventIndex] ?? {
              text: '',
              tool_calls: [],
            };
            toolEvent.text += data?.text ?? '';

            // A tool call needs to be added/updated if a tool call delta is present in the event
            if (data?.tool_call_delta) {
              const currentToolCallsIndex = data.tool_call_delta.index ?? 0;
              let toolCall = toolEvent.tool_calls?.[currentToolCallsIndex];
              if (!toolCall) {
                toolCall = {
                  name: '',
                  parameters: {},
                };
                toolCallParamaterStr = '';
              }

              if (data?.tool_call_delta?.name) {
                toolCall.name = data.tool_call_delta.name;
              }
              if (data?.tool_call_delta?.parameters) {
                toolCallParamaterStr += data?.tool_call_delta?.parameters;

                // Attempt to parse the partial parameter string as valid JSON to show that the parameters
                // are streaming in. To make the partial JSON string valid JSON after the object key comes in,
                // we naively try to add `"}` to the end.
                try {
                  const partialParams = JSON.parse(toolCallParamaterStr + `"}`);
                  toolCall.parameters = partialParams;
                } catch (e) {
                  // Ignore parsing error
                }
              }

              // Update the tool call list with the new/updated tool call
              if (toolEvent.tool_calls?.[currentToolCallsIndex]) {
                toolEvent.tool_calls[currentToolCallsIndex] = toolCall;
              } else {
                toolEvent.tool_calls?.push(toolCall);
              }
            }

            // Update the tool event list with the new/updated tool event
            if (toolEvents[currentToolEventIndex]) {
              toolEvents[currentToolEventIndex] = toolEvent;
            } else {
              toolEvents.push(toolEvent);
            }

            setStreamingMessage({
              type: MessageType.BOT,
              state: BotState.TYPING,
              text: botResponse,
              isRAGOn,
              generationId,
              originalText: botResponse,
              toolEvents,
            });
            break;
          }

          case StreamEvent.TOOL_CALLS_GENERATION: {
            const data = eventData.data;

            if (toolEvents[currentToolEventIndex]) {
              toolEvents[currentToolEventIndex] = data;
              currentToolEventIndex += 1;
            } else {
              toolEvents.push(data);
              currentToolEventIndex = toolEvents.length; // double check this is right
            }
            break;
          }

          case StreamEvent.CITATION_GENERATION: {
            const data = eventData.data;
            const newCitations = [...(data?.citations ?? [])];
            const fixedCitations = fixInlineCitationsForMarkdown(newCitations, botResponse);
            citations.push(...fixedCitations);
            citations.sort((a, b) => (a.start ?? 0) - (b.start ?? 0));
            saveCitations(generationId, fixedCitations, documentsMap);

            setStreamingMessage({
              type: MessageType.BOT,
              state: BotState.TYPING,
              text: replaceTextWithCitations(botResponse, citations, generationId),
              citations,
              isRAGOn,
              generationId,
              originalText: botResponse,
              toolEvents,
            });
            break;
          }

          case StreamEvent.STREAM_END: {
            const data = eventData.data;

            conversationId = data?.conversation_id ?? '';

            if (currentConversationId !== conversationId) {
              setConversation({ id: conversationId });
            }
            // Make sure our URL is up to date with the conversationId
            if (!window.location.pathname.includes(`c/${conversationId}`) && conversationId) {
              const newUrl =
                window.location.pathname === '/'
                  ? `c/${conversationId}`
                  : window.location.pathname + `/c/${conversationId}`;
              window?.history?.replaceState(null, '', newUrl);
              queryClient.invalidateQueries({ queryKey: ['conversations'] });
            }

            const responseText = data.text ?? '';

            addSearchResults(data?.search_results ?? []);

            // When we use documents for RAG, we don't get the documents split up by snippet
            // and their new ids until the final response. In the future, we will potentially
            // get the snippets in the citation-generation event and we can inject them there.
            const { documentsMap: newDocumentsMap, outputFilesMap: newOutputFilesMap } =
              mapDocuments(data.documents ?? []);
            documentsMap = { ...documentsMap, ...newDocumentsMap };
            outputFiles = { ...outputFiles, ...newOutputFilesMap };

            saveCitations(generationId, citations, documentsMap);
            saveOutputFiles({ ...savedOutputFiles, ...outputFiles });

            const outputText =
              data?.finish_reason === FinishReason.MAX_TOKENS ? botResponse : responseText;

            // Replace HTML code blocks with iframes
            const transformedText = replaceCodeBlockWithIframe(outputText);

            const finalText = isRAGOn
              ? replaceTextWithCitations(
                  // TODO(@wujessica): temporarily use the text generated from the stream when MAX_TOKENS
                  // because the final response doesn't give us the full text yet. Note - this means that
                  // citations will only appear for the first 'block' of text generated.
                  transformedText,
                  citations,
                  generationId
                )
              : botResponse;

            // For in-place updates, we need to make sure not to include the diagram prompt in the visible message
            let visibleText = citations.length > 0 ? finalText : fixMarkdownImagesInText(transformedText);
            let visibleOriginalText = isRAGOn ? responseText : botResponse;
            
            // Remove any prompt text from the response for hidden regenerations
            if (updateInPlace && request.message && request.message.includes("thought process")) {
              // The response might start with an acknowledgment of the diagram instructions
              // Remove such preambles to clean up the regenerated response
              const preamblePatterns = [
                /^Based on the thought process provided.*?\n\n/i,
                /^Following the reasoning structure.*?\n\n/i,
                /^Based on the diagram.*?\n\n/i,
                /^Here is a response that follows.*?\n\n/i,
                /^According to the thought process.*?\n\n/i
              ];
              
              for (const pattern of preamblePatterns) {
                visibleText = visibleText.replace(pattern, '');
                visibleOriginalText = visibleOriginalText.replace(pattern, '');
              }
            }
            
            const finalMessage: FulfilledMessage = {
              id: data.message_id,
              type: MessageType.BOT,
              state: BotState.FULFILLED,
              generationId,
              text: visibleText,
              citations,
              isRAGOn,
              originalText: visibleOriginalText,
              toolEvents,
            };

            // Handle in-place updates differently - find the last assistant message and replace it
            if (updateInPlace) {
              // Find the last index of a bot message
              let lastAssistantMessageIndex = -1;
              for (let i = newMessages.length - 1; i >= 0; i--) {
                if (newMessages[i].type === MessageType.BOT) {
                  lastAssistantMessageIndex = i;
                  break;
                }
              }
              
              if (lastAssistantMessageIndex >= 0) {
                // Create a new array with the updated message
                const updatedMessages = [...newMessages];
                updatedMessages[lastAssistantMessageIndex] = finalMessage;
                setConversation({ messages: updatedMessages });
              } else {
                // Fallback in case there's no assistant message to update
                setConversation({ messages: [...newMessages, finalMessage] });
              }
            } else {
              // Standard behavior - append the new message
              setConversation({ messages: [...newMessages, finalMessage] });
            }
            
            setStreamingMessage(null);

            // Update our result object
            result.responseText = finalMessage.text;
            result.events = toolEvents;

            if (shouldUpdateConversationTitle(newMessages)) {
              handleUpdateConversationTitle(conversationId);
            }

            break;
          }
        }
      },
      onHeaders: () => {},
      onFinish: () => {
        setIsStreaming(false);
      },
      onError: (e) => {
        citations = [];
        if (isCohereNetworkError(e)) {
          const networkError = e;
          let errorMessage = networkError.message ?? USER_ERROR_MESSAGE;

          setConversation({
            messages: newMessages.map((m: ChatMessage, i: number) =>
              i < newMessages.length - 1
                ? m
                : { ...m, error: `[${networkError.status}] ${errorMessage}` }
            ),
          });
        } else if (isStreamError(e)) {
          const streamError = e;

          const lastMessage: ErrorMessage = createErrorMessage({
            text: botResponse,
            error: `[${streamError.code}] ${USER_ERROR_MESSAGE}`,
          });

          setConversation({ messages: [...newMessages, lastMessage] });
        } else {
          let error =
            (e as CohereNetworkError)?.message ||
            'Unable to generate a response since an error was encountered.';

          if (error === 'network error' && deployment === DEPLOYMENT_COHERE_PLATFORM) {
            error += ' (Ensure a COHERE_API_KEY is configured correctly)';
          }
          setConversation({
            messages: [
              ...newMessages,
              createErrorMessage({
                text: botResponse,
                error,
              }),
            ],
          });
        }
        setIsStreaming(false);
        setStreamingMessage(null);
        setPendingMessage(null);
        
        // Set error state in result
        result.responseText = `Error: ${(e as Error).message || 'An unknown error occurred'}`;
      },
    });
    
    // Return the result object with response text and events
    return result;
  };

  const getChatRequest = (message: string, overrides?: ChatRequestOverrides): CohereChatRequest => {
    const { tools: overrideTools, ...restOverrides } = overrides ?? {};

    const requestTools = overrideTools ?? tools ?? undefined;

    return {
      message,
      conversation_id: currentConversationId,
      tools: requestTools
        ?.map((tool) => ({ name: tool.name }))
        .concat(BACKGROUND_TOOLS.map((backgroundTool) => ({ name: backgroundTool }))),
      file_ids: fileIds && fileIds.length > 0 ? fileIds : undefined,
      temperature,
      preamble,
      model,
      agent_id: agentId,
      ...restOverrides,
    };
  };

  const handleChat: HandleSendChat = async (
    { currentMessages = messages, suggestedMessage },
    overrides?: ChatRequestOverrides
  ): Promise<{ responseText?: string; events?: StreamToolCallsGeneration[] } | undefined> => {
    const message = (suggestedMessage || userMessage || '').trim();
    if (message.length === 0 || isStreaming) {
      return;
    }

    config?.onSend?.(message);
    setUserMessage('');

    const request = getChatRequest(message, overrides);
    const headers = {
      'Deployment-Name': deployment ?? '',
      'Deployment-Config': deploymentConfig ?? '',
    };
    let newMessages: ChatMessage[] = currentMessages;

    if (composerFiles.length > 0) {
      await queryClient.invalidateQueries({ queryKey: ['listFiles'] });
    }

    // Check if this is a hidden regeneration (from the flow diagram)
    // If so, don't add a new user message to the conversation
    const isHiddenRegeneration = overrides?.isHiddenRegeneration === true;
    // Check if this is an in-place update (for diagram regeneration)
    const isInPlaceUpdate = overrides?.inPlaceUpdate === true;
    
    // For hidden regeneration, we don't want to include the prompt in the user messages
    if (!isHiddenRegeneration) {
      newMessages = newMessages.concat({
        type: MessageType.USER,
        text: message,
        files: composerFiles,
      });
    }
    
    // Remove unused variable declaration

    // For in-place updates, we don't want to add the regenerated message to the conversation
    // as that would create a new message - instead we'll replace the existing one
    const shouldUpdateInPlace = isHiddenRegeneration && isInPlaceUpdate;
    
    const result = await handleStreamConverse({
      newMessages,
      request,
      headers,
      streamConverse: streamChat,
      updateInPlace: shouldUpdateInPlace
    });
    
    return result;
  };

  const handleRetry = () => {
    const latestMessage = messages[messages.length - 1];

    if (latestMessage.type === MessageType.USER) {
      // Remove last message (user message)
      const latestMessageRemoved = messages.slice(0, -1);
      const latestUserMessage = latestMessage.text;
      handleChat({ suggestedMessage: latestUserMessage, currentMessages: latestMessageRemoved });
    } else if (latestMessage.type === MessageType.BOT) {
      // Remove last messages (bot aborted message and user message)
      const latestMessagesRemoved = messages.slice(0, -2);
      const latestUserMessage = messages[messages.length - 2].text;
      handleChat({ suggestedMessage: latestUserMessage, currentMessages: latestMessagesRemoved });
    }
  };

  const handleRegenerate = async () => {
    // Find the last index of a user message
    let latestUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === MessageType.USER) {
        latestUserMessageIndex = i;
        break;
      }
    }

    if (latestUserMessageIndex === -1 || isStreaming) {
      return;
    }

    if (composerFiles.length > 0) {
      await queryClient.invalidateQueries({ queryKey: ['listFiles'] });
    }

    const newMessages = messages.slice(0, latestUserMessageIndex + 1);

    const request = getChatRequest('');

    const headers = {
      'Deployment-Name': deployment ?? '',
      'Deployment-Config': deploymentConfig ?? '',
    };

    await handleStreamConverse({
      newMessages,
      request,
      headers,
      streamConverse: streamChat,
    });
  };

  const handleStop = () => {
    if (!isStreaming) return;
    abortController.current?.abort(ABORT_REASON_USER);
    setIsStreaming(false);
    setConversation({
      messages: [
        ...messages,
        createAbortedMessage({
          text: streamingMessage?.text ?? '',
        }),
      ],
    });
    setStreamingMessage(null);
  };

  return {
    userMessage,
    isStreaming,
    isStreamingToolEvents,
    handleSend: handleChat,
    handleStop,
    handleRetry,
    handleRegenerate,
    streamingMessage,
    setPendingMessage,
    setUserMessage,
  };
};
