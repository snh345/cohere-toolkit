// // 'use client';

// // import { Transition } from '@headlessui/react';
// // import { Fragment, PropsWithChildren } from 'react';

// import { StreamSearchResults, StreamToolCallsGeneration, ToolCall } from '@/cohere-client';
// // import { Markdown } from '@/components/Markdown';
// // import { Icon, IconButton, IconName, Text, Tooltip } from '@/components/UI';
// // import {
// //   TOOL_CALCULATOR_ID,
// //   TOOL_GOOGLE_DRIVE_ID,
// //   TOOL_PYTHON_INTERPRETER_ID,
// //   TOOL_WEB_SEARCH_ID,
// // } from '@/constants';
// // import { cn, getToolIcon, getValidURL } from '@/utils';

// // type Props = {
// //   show: boolean;
// //   isStreaming: boolean;
// //   isLast: boolean;
// //   events: StreamToolCallsGeneration[] | undefined;
// // };

// // const hasToolErrorsDocuments = (search_results: StreamSearchResults | null) => {
// //   return search_results?.documents?.some((document) => document.fields?.success === 'false');
// // };

// // const getErrorDocumentsFromEvent = (search_results: StreamSearchResults | null) =>
// //   search_results?.documents?.filter((document) => document.fields?.success === 'false') || [];

// // /**
// //  * @description Renders a list of events depending on the model's plan and tool inputs.
// //  */
// // export const ToolEvents: React.FC<Props> = ({ show, isStreaming, isLast, events }) => {
// //   return (
// //     <Transition
// //       show={show}
// //       enterFrom="opacity-0"
// //       enterTo="opacity-100"
// //       enter="duration-500"
// //       leaveFrom="opacity-100"
// //       leaveTo="opacity-0"
// //       as="div"
// //       className={cn('flex w-full flex-col gap-y-2 pb-2', 'transition-opacity ease-in-out')}
// //     >
// //       {events?.map((toolEvent, i) => (
// //         <Fragment key={i}>
// //           {toolEvent.stream_search_results && toolEvent.stream_search_results.search_results && (
// //             <ToolEvent stream_search_results={toolEvent.stream_search_results} />
// //           )}
// //           {toolEvent.text && <ToolEvent plan={toolEvent.text} />}
// //           {toolEvent.tool_calls?.map((toolCall, j) => (
// //             <ToolEvent key={`event-${j}`} event={toolCall} />
// //           ))}
// //         </Fragment>
// //       ))}
// //       {isStreaming && isLast && (
// //         <Text className={cn('flex min-w-0 text-volcanic-400')} as="span">
// //           Working on it
// //           <span className="w-max">
// //             <div className="animate-typing-ellipsis overflow-hidden whitespace-nowrap pr-1">
// //               ...
// //             </div>
// //           </span>
// //         </Text>
// //       )}
// //     </Transition>
// //   );
// // };



// 'use client';

// import { Transition } from '@headlessui/react';
// import { Fragment, PropsWithChildren, useState } from 'react';

// import { Markdown } from '@/components/Markdown';
// import { Icon, IconButton, IconName, Text, Tooltip, Button } from '@/components/UI';
// import {
//   TOOL_CALCULATOR_ID,
//   TOOL_GOOGLE_DRIVE_ID,
//   TOOL_PYTHON_INTERPRETER_ID,
//   TOOL_WEB_SEARCH_ID,
// } from '@/constants';
// import { cn, getToolIcon, getValidURL } from '@/utils';
// import PlanFlowDiagram from './PlanFlowDiagram';



// type Props = {
//   show: boolean;
//   isStreaming: boolean;
//   isLast: boolean;
//   events: StreamToolCallsGeneration[] | undefined;
// };

// const hasToolErrorsDocuments = (search_results: StreamSearchResults | null) => {
//   return search_results?.documents?.some((document) => document.fields?.success === 'false');
// };

// const getErrorDocumentsFromEvent = (search_results: StreamSearchResults | null) =>
//   search_results?.documents?.filter((document) => document.fields?.success === 'false') || [];

// /**
//  * @description Renders a list of events depending on the model's plan and tool inputs.
//  */
// export const ToolEvents: React.FC<Props> = ({ show, isStreaming, isLast, events }) => {
//   const [showFlowDiagram, setShowFlowDiagram] = useState(false);

//   // Only enable the flow diagram button when there are events and they're not streaming
//   const canShowFlowDiagram = !isStreaming && events && events.length > 0;

//   return (
//     <Transition
//       show={show}
//       enterFrom="opacity-0"
//       enterTo="opacity-100"
//       enter="duration-500"
//       leaveFrom="opacity-100"
//       leaveTo="opacity-0"
//       as="div"
//       className={cn('flex w-full flex-col gap-y-2 pb-2', 'transition-opacity ease-in-out')}
//     >
//       {/* Flow diagram button */}
//       {canShowFlowDiagram && (
//         <div className="flex justify-end mb-2">
//           <Button
//             onClick={() => setShowFlowDiagram(true)}
//             className="flex items-center gap-1 text-xs"
//           >
//             <Icon 
//               name="show"
//               className="h-4 w-4 fill-mushroom-500 dark:fill-marble-950" 
//             />
//             View Plan Flow
//           </Button>
//         </div>
//       )}

//       {events?.map((toolEvent, i) => (
//         <Fragment key={i}>
//           {toolEvent.stream_search_results && toolEvent.stream_search_results.search_results && (
//             <ToolEvent stream_search_results={toolEvent.stream_search_results} />
//           )}
//           {toolEvent.text && <ToolEvent plan={toolEvent.text} />}
//           {toolEvent.tool_calls?.map((toolCall, j) => (
//             <ToolEvent key={`event-${j}`} event={toolCall} />
//           ))}
//         </Fragment>
//       ))}

//       {isStreaming && isLast && (
//         <Text className={cn('flex min-w-0 text-volcanic-400')} as="span">
//           Working on it
//           <span className="w-max">
//             <div className="animate-typing-ellipsis overflow-hidden whitespace-nowrap pr-1">
//               ...
//             </div>
//           </span>
//         </Text>
//       )}

//       {/* React Flow Diagram Modal */}
//       <PlanFlowDiagram 
//         isOpen={showFlowDiagram}
//         onClose={() => setShowFlowDiagram(false)}
//         events={events}
//       />
//     </Transition>
//   );
// };

// type ToolEventProps = {
//   plan?: string;
//   event?: ToolCall;
//   stream_search_results?: StreamSearchResults | null;
// };

// /**
//  * @description Renders a step event depending on the tool's input or output. IMPORTANT!!
//  */
// const ToolEvent: React.FC<ToolEventProps> = ({ plan, event, stream_search_results }) => {
//   if (plan) {
//     return <ToolEventWrapper>{plan}</ToolEventWrapper>;
//   }
//   const toolName = event?.name || '';

//   if (stream_search_results) {
//     const artifacts =
//       stream_search_results.documents
//         ?.map((doc) => {
//           return { title: truncateString(doc.title || doc.url || ''), url: getValidURL(doc.url) };
//         })
//         .filter((entry) => !!entry.title)
//         .filter((value, index, self) => index === self.findIndex((t) => t.title === value.title)) ||
//       [];

//     const hasErrorsDocuments = hasToolErrorsDocuments(stream_search_results);
//     const errorDocuments = getErrorDocumentsFromEvent(stream_search_results);

//     return hasErrorsDocuments ? (
//       <ToolErrorWrapper
//         tooltip={errorDocuments[errorDocuments.length - 1].fields?.details as string}
//       >
//         {errorDocuments[errorDocuments.length - 1].text}
//       </ToolErrorWrapper>
//     ) : toolName && toolName != TOOL_PYTHON_INTERPRETER_ID ? (
//       <ToolEventWrapper icon="book-open-text">
//         {artifacts.length > 0 ? (
//           <>
//             Referenced the following resources:
//             <article className="grid grid-cols-2 gap-x-2">
//               {artifacts.map((artifact) => (
//                 <b key={artifact.title} className="truncate font-medium">
//                   {artifact.url ? (
//                     <a href={artifact.url} target="_blank" className="underline">
//                       {artifact.title}
//                     </a>
//                   ) : (
//                     <p>{artifact.title}</p>
//                   )}
//                 </b>
//               ))}
//             </article>
//           </>
//         ) : (
//           <>No resources found.</>
//         )}
//       </ToolEventWrapper>
//     ) : null;
//   }

//   const icon = getToolIcon(toolName);

//   switch (toolName) {
//     case TOOL_PYTHON_INTERPRETER_ID: {
//       if (event?.parameters?.code) {
//         let codeString = '```python\n';
//         codeString += event?.parameters?.code;
//         codeString += '\n```';

//         return (
//           <>
//             <ToolEventWrapper icon={icon}>
//               Using <b className="font-medium">{toolName}.</b>
//             </ToolEventWrapper>
//             <Markdown text={codeString} className="w-full" />
//           </>
//         );
//       } else {
//         return (
//           <ToolEventWrapper icon={icon}>
//             Using <b className="font-medium">{toolName}.</b>
//           </ToolEventWrapper>
//         );
//       }
//     }

//     case TOOL_CALCULATOR_ID: {
//       return (
//         <ToolEventWrapper icon={icon}>
//           Calculating <b className="font-medium">{event?.parameters?.code as any}.</b>
//         </ToolEventWrapper>
//       );
//     }

//     case TOOL_WEB_SEARCH_ID: {
//       return (
//         <ToolEventWrapper icon={icon}>
//           Searching <b className="font-medium">{event?.parameters?.query as any}.</b>
//         </ToolEventWrapper>
//       );
//     }

//     case TOOL_GOOGLE_DRIVE_ID: {
//       return (
//         <ToolEventWrapper icon={icon}>
//           Searching <b className="font-medium">{event?.parameters?.query as any}</b> in {toolName}.
//         </ToolEventWrapper>
//       );
//     }

//     default: {
//       return (
//         <ToolEventWrapper icon={icon}>
//           Using <b className="font-medium">{toolName}.</b>
//         </ToolEventWrapper>
//       );
//     }
//   }
// };

// /**
//  * @description Renders the wrapper for the tool event.
//  */
// const ToolEventWrapper: React.FC<PropsWithChildren<{ icon?: IconName }>> = ({
//   icon = 'list',
//   children,
// }) => {
//   return (
//     <div className="flex w-full items-start gap-x-2 overflow-hidden rounded bg-mushroom-950 px-3 py-2 transition-colors ease-in-out group-hover:bg-mushroom-900 dark:bg-volcanic-200 dark:group-hover:bg-volcanic-200">
//       <Icon
//         name={icon}
//         kind="outline"
//         className="mt-0.5 flex h-[21px] flex-shrink-0 items-center fill-mushroom-500 dark:fill-marble-950"
//       />
//       <Text className="pt-px text-mushroom-300 dark:text-marble-850" styleAs="p-sm" as="span">
//         {children}
//       </Text>
//     </div>
//   );
// };

// const ToolErrorWrapper: React.FC<PropsWithChildren<{ tooltip: string }>> = ({
//   tooltip = 'Some error occurred',
//   children,
// }) => {
//   return (
//     <div className="flex w-full items-start gap-x-2 overflow-hidden rounded bg-mushroom-950 px-3 py-2 transition-colors ease-in-out group-hover:bg-mushroom-900 dark:bg-volcanic-200 dark:group-hover:bg-volcanic-200">
//       <Tooltip
//         label={tooltip}
//         size={'sm'}
//         hover
//         iconClassName="mt-0.5 flex h-[21px] flex-shrink-0 items-center fill-danger-350 dark:fill-danger-500"
//       />
//       <Text className="pt-px text-danger-350 dark:text-danger-500" styleAs="p-sm" as="span">
//         {children}
//       </Text>
//     </div>
//   );
// };

// const truncateString = (str: string, max_length: number = 50) => {
//   return str.length < max_length ? str : str.substring(0, max_length) + '...';
// };


/// I LOVE GITHUB 2/26

'use client';

import { Transition } from '@headlessui/react';
import { Fragment, PropsWithChildren, useState } from 'react';

import { StreamSearchResults, StreamToolCallsGeneration, ToolCall } from '@/cohere-client';
import { Markdown } from '@/components/Markdown';
import { Icon, IconButton, IconName, Text, Tooltip, Button } from '@/components/UI';
import {
  TOOL_CALCULATOR_ID,
  TOOL_GOOGLE_DRIVE_ID,
  TOOL_PYTHON_INTERPRETER_ID,
  TOOL_WEB_SEARCH_ID,
} from '@/constants';
import { cn, getToolIcon, getValidURL } from '@/utils';
import PlanFlowDiagram from './PlanFlowDiagram';

// Type for regeneration data from flow
type RegenerationData = {
  nodes: {
    id: string;
    content: string;
    title?: string;
    branchType: string;
    position: { x: number; y: number };
  }[];
  edges: {
    source: string;
    target: string;
    branchType: string;
  }[];
};

type Props = {
  show: boolean;
  isStreaming: boolean;
  isLast: boolean;
  events: StreamToolCallsGeneration[] | undefined;
  onRegenerate?: (response: string, events: StreamToolCallsGeneration[]) => void;
  // Add reference to the existing message submission function
  submitMessage?: (message: string) => Promise<any>;
};

const hasToolErrorsDocuments = (search_results: StreamSearchResults | null) => {
  return search_results?.documents?.some((document) => document.fields?.success === 'false');
};

const getErrorDocumentsFromEvent = (search_results: StreamSearchResults | null) =>
  search_results?.documents?.filter((document) => document.fields?.success === 'false') || [];

/**
 * @description Renders a list of events depending on the model's plan and tool inputs.
 */
export const ToolEvents: React.FC<Props> = ({ 
  show, 
  isStreaming, 
  isLast, 
  events,
  onRegenerate,
  submitMessage
}) => {
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratedResponse, setRegeneratedResponse] = useState<string>('');
  const [regeneratedEvents, setRegeneratedEvents] = useState<StreamToolCallsGeneration[] | undefined>(undefined);

  // Only enable the flow diagram button when there are events and they're not streaming
  const canShowFlowDiagram = !isStreaming && events && events.length > 0;

  // Handle regeneration from flow diagram using the existing endpoint
  // const handleRegenerateFromFlow = async (flowData: RegenerationData) => {
  //   if (!submitMessage) {
  //     return "Error: Message submission function not available. Cannot regenerate.";
  //   }
    
  //   try {
  //     setIsRegenerating(true);
      
  //     // Convert flow data to a format that can be used as a message prompt
  //     const mainPath = flowData.nodes
  //       .filter(node => node.branchType === 'primary')
  //       .sort((a, b) => a.position.y - b.position.y);
      
  //     // Find all connected alternative branches
  //     const alternativePaths = [];
  //     const processedAlternatives = new Set();
      
  //     for (const node of mainPath) {
  //       // Find edges where this node is the source
  //       const outgoingEdges = flowData.edges.filter(edge => 
  //         edge.source === node.id && edge.branchType === 'alternative'
  //       );
        
  //       for (const edge of outgoingEdges) {
  //         if (processedAlternatives.has(edge.target)) continue;
          
  //         const altPath = [];
  //         let currentNodeId = edge.target || null;
          
  //         // Follow this branch to collect all nodes in sequence
  //         while (currentNodeId) {
  //           const currentNode = flowData.nodes.find(n => n.id === currentNodeId);
  //           if (!currentNode || processedAlternatives.has(currentNodeId)) break;
            
  //           altPath.push(currentNode);
  //           processedAlternatives.add(currentNodeId);
            
  //           // Find the next node in this branch
  //           const nextEdge = flowData.edges.find(e => e.source === currentNodeId);
  //           currentNodeId = nextEdge?.target || null;
  //         }
          
  //         if (altPath.length > 0) {
  //           alternativePaths.push(altPath);
  //         }
  //       }
  //     }
      
  //     // Format as a natural language prompt to pass to the existing endpoint
  //     let prompt = "Please generate a response based on the following thought process:\n\n";
      
  //     // Add main path steps
  //     prompt += "Main thought path:\n";
  //     mainPath.forEach((node, index) => {
  //       prompt += `${index + 1}. ${node.title || 'Step'}: ${node.content}\n`;
  //     });
      
  //     // Add alternative paths if they exist
  //     if (alternativePaths.length > 0) {
  //       prompt += "\nAlternative thought paths to consider:\n";
  //       alternativePaths.forEach((path, pathIndex) => {
  //         prompt += `Alternative ${pathIndex + 1}:\n`;
  //         path.forEach((node, stepIndex) => {
  //           prompt += `  - ${node.title || 'Step'}: ${node.content}\n`;
  //         });
  //         prompt += "\n";
  //       });
  //     }
      
  //     // Add instructions for format
  //     prompt += "\nPlease provide a comprehensive response that follows this reasoning structure.";
      
  //     console.log('Submitting regeneration prompt');
      
  //     // Call the existing message submission function
  //     const result = await submitMessage(prompt);
      
  //     // The result structure depends on your implementation, but assuming it contains 
  //     // response text and events, we can update our state
  //     if (result && result.events) {
  //       setRegeneratedEvents(result.events);
  //     }
      
  //     if (result && result.responseText) {
  //       setRegeneratedResponse(result.responseText);
        
  //       // Call parent callback if provided
  //       if (onRegenerate && result.events) {
  //         onRegenerate(result.responseText, result.events);
  //       }
        
  //       return result.responseText;
  //     }
      
  //     return "Regeneration complete. You'll see the updated response when you close this dialog.";
      
  //   } catch (error) {
  //     console.error('Error regenerating from flow:', error);
  //     return "Error: Failed to regenerate response. Please try again.";
  //   } finally {
  //     setIsRegenerating(false);
  //   }
  // };
// Handle regeneration from flow diagram using the existing endpoint
// Define types for our graph traversal structures
type NodeConnection = {
  target: string;
  branchType: string;
};

type BranchEntryPoint = {
  primaryNode: RegenerationData['nodes'][0];
  alternativeNode: RegenerationData['nodes'][0];
  entryEdge: NodeConnection;
};

type AlternativePath = {
  startFromPrimary: RegenerationData['nodes'][0];
  path: RegenerationData['nodes'][0][];
};

// Handle regeneration from flow diagram using the existing endpoint
const handleRegenerateFromFlow = async (flowData: RegenerationData) => {
  if (!submitMessage) {
    return "Error: Message submission function not available. Cannot regenerate.";
  }
  
  try {
    setIsRegenerating(true);
    
    // Extract all nodes and edges 
    const { nodes, edges } = flowData;
    
    // Identify primary and alternative nodes
    const primaryNodes = nodes
      .filter(node => node.branchType === 'primary' || !node.branchType)
      .sort((a, b) => a.position.y - b.position.y);
    
    const alternativeNodes = nodes
      .filter(node => node.branchType === 'alternative');
    
    // Create a graph representation for traversal
    const nodeConnections = new Map<string, NodeConnection[]>();
    edges.forEach(edge => {
      if (!nodeConnections.has(edge.source)) {
        nodeConnections.set(edge.source, []);
      }
      nodeConnections.get(edge.source)!.push({
        target: edge.target,
        branchType: edge.branchType
      });
    });
    
    // Find all branch points - where a primary node connects to an alternative node
    const branchPoints: Array<{
      primaryNode: RegenerationData['nodes'][0],
      alternativeStartNodes: RegenerationData['nodes'][0][]
    }> = [];
    
    // For each primary node, find all alternative nodes it connects to
    primaryNodes.forEach(primaryNode => {
      const connections = nodeConnections.get(primaryNode.id) || [];
      const alternativeTargets: RegenerationData['nodes'][0][] = [];
      
      connections.forEach(conn => {
        // Find the target node
        const targetNode = nodes.find(n => n.id === conn.target);
        
        // Check if the target node is an alternative node
        if (targetNode && targetNode.branchType === 'alternative') {
          alternativeTargets.push(targetNode);
        }
      });
      
      if (alternativeTargets.length > 0) {
        branchPoints.push({
          primaryNode,
          alternativeStartNodes: alternativeTargets
        });
      }
    });
    
    // For each branch point, trace all possible alternative paths
    const alternativePaths: Array<{
      fromPrimaryNode: RegenerationData['nodes'][0],
      alternativePath: RegenerationData['nodes'][0][]
    }> = [];
    
    branchPoints.forEach(branchPoint => {
      const { primaryNode, alternativeStartNodes } = branchPoint;
      
      // For each alternative starting node, trace a path through the graph
      alternativeStartNodes.forEach(startNode => {
        const path: RegenerationData['nodes'][0][] = [startNode];
        const visited = new Set<string>([startNode.id]);
        
        let currentNodeId = startNode.id;
        
        // Follow the path as far as possible
        while (true) {
          const nextConnections = nodeConnections.get(currentNodeId) || [];
          if (nextConnections.length === 0) break;
          
          // Find the next unvisited node
          const nextConn = nextConnections.find(conn => !visited.has(conn.target));
          if (!nextConn) break;
          
          // Find the node object
          const nextNode = nodes.find(n => n.id === nextConn.target);
          if (!nextNode) break;
          
          // Add to the path and continue
          path.push(nextNode);
          visited.add(nextNode.id);
          currentNodeId = nextNode.id;
        }
        
        // Store this alternative path
        if (path.length > 0) {
          alternativePaths.push({
            fromPrimaryNode: primaryNode,
            alternativePath: path
          });
        }
      });
    });
    
    // Format as a natural language prompt with clear instructions not to reference the thought process
    let prompt = "Based on the edited diagram, respond with a cohesive and direct answer that utilizes the following thought flow. DO NOT refer to these thoughts or mention them in your response - they are for your internal reasoning only:\n\n";
    
    // Add main path steps
    prompt += "Main thought path:\n";
    primaryNodes.forEach((node, index) => {
      prompt += `${index + 1}. ${node.title || 'Step'}: ${node.content}\n`;
    });
    
    // Add alternative paths if they exist
    if (alternativePaths.length > 0) {
      prompt += "\nAlternative thought paths to consider:\n";
      alternativePaths.forEach((pathInfo, pathIndex) => {
        const primaryNodeIndex = primaryNodes.findIndex(n => n.id === pathInfo.fromPrimaryNode.id);
        
        prompt += `Alternative ${pathIndex + 1} (branches from main step ${primaryNodeIndex + 1}):\n`;
        pathInfo.alternativePath.forEach((node, nodeIndex) => {
          prompt += `  - ${node.title || 'Step'}: ${node.content}\n`;
        });
        prompt += "\n";
      });
    }
    
    // Add instructions for format with strong emphasis on not mentioning the diagram
    prompt += "\nVERY IMPORTANT: Your response should be seamless and conversational. DO NOT mention the diagram, the steps, or that you are following a thought process. Simply provide a clean, direct response as if this structure was your own internal reasoning.";
    
    console.log('Submitting regeneration prompt:', prompt);
    
    // Pass special flags to indicate both hidden regeneration and in-place update
    // to ensure the response updates the existing message bubble
    const result = await submitMessage(prompt, { 
      isHiddenRegeneration: true,
      inPlaceUpdate: true
    });
    
    // If we received a result with events and responseText, update our state
    if (result && result.events) {
      setRegeneratedEvents(result.events);
    }
    
    if (result && result.responseText) {
      setRegeneratedResponse(result.responseText);
      
      // Call parent callback if provided - this will update the message bubble
      if (onRegenerate && result.events) {
        onRegenerate(result.responseText, result.events);
      }
      
      return result.responseText;
    }
    
    return "Regeneration complete. You'll see the updated response when you close this dialog.";
    
  } catch (error) {
    console.error('Error regenerating from flow:', error);
    return "Error: Failed to regenerate response. Please try again.";
  } finally {
    setIsRegenerating(false);
  }
};
// const handleRegenerateFromFlow = async (flowData: RegenerationData) => {
//   if (!submitMessage) {
//     return "Error: Message submission function not available. Cannot regenerate.";
//   }
  
//   try {
//     setIsRegenerating(true);
    
//     // Extract all nodes and edges 
//     const { nodes, edges } = flowData;
    
//     // Identify primary and alternative nodes
//     const primaryNodes = nodes
//       .filter(node => node.branchType === 'primary' || !node.branchType)
//       .sort((a, b) => a.position.y - b.position.y);
    
//     const alternativeNodes = nodes
//       .filter(node => node.branchType === 'alternative');
    
//     // Create a graph representation for traversal
//     const nodeConnections = new Map<string, NodeConnection[]>();
//     edges.forEach(edge => {
//       if (!nodeConnections.has(edge.source)) {
//         nodeConnections.set(edge.source, []);
//       }
//       nodeConnections.get(edge.source)!.push({
//         target: edge.target,
//         branchType: edge.branchType
//       });
//     });
    
//     // Identify entry points for alternative branches
//     const altBranchEntryPoints: BranchEntryPoint[] = [];
    
//     primaryNodes.forEach(primaryNode => {
//       const connections = nodeConnections.get(primaryNode.id) || [];
//       connections.forEach(conn => {
//         if (conn.branchType === 'alternative') {
//           // Find the alternative node
//           const altNode = alternativeNodes.find(n => n.id === conn.target);
//           if (altNode) {
//             altBranchEntryPoints.push({
//               primaryNode,
//               alternativeNode: altNode,
//               entryEdge: conn
//             });
//           }
//         }
//       });
//     });
    
//     // For each entry point, trace the complete alternative path
//     const alternativePaths: AlternativePath[] = [];
    
//     altBranchEntryPoints.forEach(entry => {
//       const path: RegenerationData['nodes'][0][] = [entry.alternativeNode];
//       const visited = new Set<string>([entry.alternativeNode.id]);
      
//       // Start from the entry alternative node and follow connections
//       let currentNodeId = entry.alternativeNode.id;
      
//       while (nodeConnections.has(currentNodeId)) {
//         const nextConnections = nodeConnections.get(currentNodeId) || [];
        
//         // Find the next node that hasn't been visited
//         const nextConn = nextConnections.find(conn => !visited.has(conn.target));
        
//         if (!nextConn) break; // No more unvisited connections
        
//         const nextNode = nodes.find(n => n.id === nextConn.target);
//         if (!nextNode) break;
        
//         path.push(nextNode);
//         visited.add(nextNode.id);
//         currentNodeId = nextNode.id;
//       }
      
//       if (path.length > 0) {
//         alternativePaths.push({
//           startFromPrimary: entry.primaryNode,
//           path
//         });
//       }
//     });
    
//     // Format as a natural language prompt 
//     let prompt = "Please generate a response based on the following thought process:\n\n";
    
//     // Add main path steps
//     prompt += "Main thought path:\n";
//     primaryNodes.forEach((node, index) => {
//       prompt += `${index + 1}. ${node.title || 'Step'}: ${node.content}\n`;
//     });
    
//     // Add alternative paths if they exist
//     if (alternativeNodes.length > 0) {
//       prompt += "\nAlternative thought paths to consider:\n";
//       alternativePaths.forEach((pathInfo, pathIndex) => {
//         const primaryNodeIndex = primaryNodes.findIndex(n => n.id === pathInfo.startFromPrimary.id);
        
//         prompt += `Alternative ${pathIndex + 1} (branches from main step ${primaryNodeIndex + 1}):\n`;
//         pathInfo.path.forEach((node, nodeIndex) => {
//           prompt += `  - ${node.title || 'Step'}: ${node.content}\n`;
//         });
//         prompt += "\n";
//       });
//     }
    
//     // Add instructions for format
//     prompt += "\nPlease provide a comprehensive response that follows this reasoning structure and incorporates insights from the alternative paths when relevant.";
    
//     console.log('Submitting regeneration prompt:', prompt);
//     console.log('alt nodes:', alternativeNodes);
    
//     // Call the existing message submission function
//     const result = await submitMessage(prompt);
    
//     // Handle the result as before
//     if (result && result.events) {
//       setRegeneratedEvents(result.events);
//     }
    
//     if (result && result.responseText) {
//       setRegeneratedResponse(result.responseText);
      
//       // Call parent callback if provided
//       if (onRegenerate && result.events) {
//         onRegenerate(result.responseText, result.events);
//       }
      
//       return result.responseText;
//     }
    
//     return "Regeneration complete. You'll see the updated response when you close this dialog.";
    
//   } catch (error) {
//     console.error('Error regenerating from flow:', error);
//     return "Error: Failed to regenerate response. Please try again.";
//   } finally {
//     setIsRegenerating(false);
//   }
// };

  // When closing the diagram with regenerated content, update the parent component
  const handleCloseFlowDiagram = () => {
    setShowFlowDiagram(false);
    
    // If there's regenerated content and the parent provided a callback, update the parent
    if (regeneratedResponse && regeneratedEvents && onRegenerate) {
      onRegenerate(regeneratedResponse, regeneratedEvents);
    }
  };

  return (
    <Transition
      show={show}
      enterFrom="opacity-0"
      enterTo="opacity-100"
      enter="duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="div"
      className={cn('flex w-full flex-col gap-y-2 pb-2', 'transition-opacity ease-in-out')}
    >
      {/* Flow diagram button */}
      {canShowFlowDiagram && (
        <div className="flex justify-end mb-2">
          <Button
            onClick={() => setShowFlowDiagram(true)}
            className="flex items-center gap-1 text-xs"
          >
            <Icon 
              name="show"
              className="h-4 w-4 fill-mushroom-500 dark:fill-marble-950" 
            />
            View Plan Flow
          </Button>
        </div>
      )}

      {/* Display the current events (either original or regenerated) */}
      {(regeneratedEvents || events)?.map((toolEvent, i) => (
        <Fragment key={i}>
          {toolEvent.stream_search_results && toolEvent.stream_search_results.search_results && (
            <ToolEvent stream_search_results={toolEvent.stream_search_results} />
          )}
          {toolEvent.text && <ToolEvent plan={toolEvent.text} />}
          {toolEvent.tool_calls?.map((toolCall, j) => (
            <ToolEvent key={`event-${j}`} event={toolCall} />
          ))}
        </Fragment>
      ))}

      {isStreaming && isLast && (
        <Text className={cn('flex min-w-0 text-volcanic-400')} as="span">
          Working on it
          <span className="w-max">
            <div className="animate-typing-ellipsis overflow-hidden whitespace-nowrap pr-1">
              ...
            </div>
          </span>
        </Text>
      )}

      {/* React Flow Diagram Modal with regeneration capability */}
      <PlanFlowDiagram 
        isOpen={showFlowDiagram}
        onClose={handleCloseFlowDiagram}
        events={regeneratedEvents || events}
        onRegenerateFromFlow={submitMessage ? handleRegenerateFromFlow : undefined}
      />
    </Transition>
  );
};

// Rest of the component remains the same...

type ToolEventProps = {
  plan?: string;
  event?: ToolCall;
  stream_search_results?: StreamSearchResults | null;
};

/**
 * @description Renders a step event depending on the tool's input or output.
 */
const ToolEvent: React.FC<ToolEventProps> = ({ plan, event, stream_search_results }) => {
  if (plan) {
    return <ToolEventWrapper>{plan}</ToolEventWrapper>;
  }
  const toolName = event?.name || '';

  if (stream_search_results) {
    const artifacts =
      stream_search_results.documents
        ?.map((doc) => {
          return { title: truncateString(doc.title || doc.url || ''), url: getValidURL(doc.url) };
        })
        .filter((entry) => !!entry.title)
        .filter((value, index, self) => index === self.findIndex((t) => t.title === value.title)) ||
      [];

    const hasErrorsDocuments = hasToolErrorsDocuments(stream_search_results);
    const errorDocuments = getErrorDocumentsFromEvent(stream_search_results);

    return hasErrorsDocuments ? (
      <ToolErrorWrapper
        tooltip={errorDocuments[errorDocuments.length - 1].fields?.details as string}
      >
        {errorDocuments[errorDocuments.length - 1].text}
      </ToolErrorWrapper>
    ) : toolName && toolName != TOOL_PYTHON_INTERPRETER_ID ? (
      <ToolEventWrapper icon="book-open-text">
        {artifacts.length > 0 ? (
          <>
            Referenced the following resources:
            <article className="grid grid-cols-2 gap-x-2">
              {artifacts.map((artifact) => (
                <b key={artifact.title} className="truncate font-medium">
                  {artifact.url ? (
                    <a href={artifact.url} target="_blank" className="underline">
                      {artifact.title}
                    </a>
                  ) : (
                    <p>{artifact.title}</p>
                  )}
                </b>
              ))}
            </article>
          </>
        ) : (
          <>No resources found.</>
        )}
      </ToolEventWrapper>
    ) : null;
  }

  const icon = getToolIcon(toolName);

  switch (toolName) {
    case TOOL_PYTHON_INTERPRETER_ID: {
      if (event?.parameters?.code) {
        let codeString = '```python\n';
        codeString += event?.parameters?.code;
        codeString += '\n```';

        return (
          <>
            <ToolEventWrapper icon={icon}>
              Using <b className="font-medium">{toolName}.</b>
            </ToolEventWrapper>
            <Markdown text={codeString} className="w-full" />
          </>
        );
      } else {
        return (
          <ToolEventWrapper icon={icon}>
            Using <b className="font-medium">{toolName}.</b>
          </ToolEventWrapper>
        );
      }
    }

    case TOOL_CALCULATOR_ID: {
      return (
        <ToolEventWrapper icon={icon}>
          Calculating <b className="font-medium">{event?.parameters?.code as any}.</b>
        </ToolEventWrapper>
      );
    }

    case TOOL_WEB_SEARCH_ID: {
      return (
        <ToolEventWrapper icon={icon}>
          Searching <b className="font-medium">{event?.parameters?.query as any}.</b>
        </ToolEventWrapper>
      );
    }

    case TOOL_GOOGLE_DRIVE_ID: {
      return (
        <ToolEventWrapper icon={icon}>
          Searching <b className="font-medium">{event?.parameters?.query as any}</b> in {toolName}.
        </ToolEventWrapper>
      );
    }

    default: {
      return (
        <ToolEventWrapper icon={icon}>
          Using <b className="font-medium">{toolName}.</b>
        </ToolEventWrapper>
      );
    }
  }
};

/**
 * @description Renders the wrapper for the tool event.
 */
const ToolEventWrapper: React.FC<PropsWithChildren<{ icon?: IconName }>> = ({
  icon = 'list',
  children,
}) => {
  return (
    <div className="flex w-full items-start gap-x-2 overflow-hidden rounded bg-mushroom-950 px-3 py-2 transition-colors ease-in-out group-hover:bg-mushroom-900 dark:bg-volcanic-200 dark:group-hover:bg-volcanic-200">
      <Icon
        name={icon}
        kind="outline"
        className="mt-0.5 flex h-[21px] flex-shrink-0 items-center fill-mushroom-500 dark:fill-marble-950"
      />
      <Text className="pt-px text-mushroom-300 dark:text-marble-850" styleAs="p-sm" as="span">
        {children}
      </Text>
    </div>
  );
};

const ToolErrorWrapper: React.FC<PropsWithChildren<{ tooltip: string }>> = ({
  tooltip = 'Some error occurred',
  children,
}) => {
  return (
    <div className="flex w-full items-start gap-x-2 overflow-hidden rounded bg-mushroom-950 px-3 py-2 transition-colors ease-in-out group-hover:bg-mushroom-900 dark:bg-volcanic-200 dark:group-hover:bg-volcanic-200">
      <Tooltip
        label={tooltip}
        size={'sm'}
        hover
        iconClassName="mt-0.5 flex h-[21px] flex-shrink-0 items-center fill-danger-350 dark:fill-danger-500"
      />
      <Text className="pt-px text-danger-350 dark:text-danger-500" styleAs="p-sm" as="span">
        {children}
      </Text>
    </div>
  );
};

const truncateString = (str: string, max_length: number = 50) => {
  return str.length < max_length ? str : str.substring(0, max_length) + '...';
};

// BACON 2/27
