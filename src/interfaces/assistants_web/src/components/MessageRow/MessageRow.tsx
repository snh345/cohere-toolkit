'use client';

import { forwardRef, useEffect, useState } from 'react';
import { useLongPress } from 'react-aria';

import { StreamToolCallsGeneration } from '@/cohere-client';
import { Avatar, MessageContent, ToolEvents } from '@/components/MessageRow';
import {
  Button,
  CopyToClipboardButton,
  CopyToClipboardIconButton,
  IconButton,
  LongPressMenu,
} from '@/components/UI';
import { Breakpoint, useBreakpoint } from '@/hooks';
import { useExperimentalFeatures } from '@/hooks/use-experimentalFeatures';
import { SynthesisStatus } from '@/hooks/use-synthesizer';
import { useSettingsStore } from '@/stores';
import { ConfigurableParams } from '@/stores/slices/paramsSlice';
import {
  type ChatMessage,
  isAbortedMessage,
  isBotMessage,
  isErroredMessage,
  isFulfilledMessage,
  isFulfilledOrTypingMessage,
  isUserMessage,
} from '@/types/message';
import { RegenerationData } from '@/types/tools';
import { cn } from '@/utils';

type Props = {
  isLast: boolean;
  message: ChatMessage;
  isStreamingToolEvents: boolean;
  isReadOnly?: boolean;
  synthesisStatus?: SynthesisStatus;
  delay?: boolean;
  className?: string;
  onCopy?: VoidFunction;
  onRetry?: VoidFunction;
  onRegenerate?: VoidFunction;
  onToggleSynthesis?: VoidFunction;
  // New props for flow diagram regeneration
  handleSend?: (message?: string, overrides?: Partial<ConfigurableParams>) => Promise<any>;
  onRegenerateFromFlow?: (flowData: RegenerationData) => Promise<void>;
};

/**
 * Renders a single message row from the user or from our models.
 */
export const MessageRow = forwardRef<HTMLDivElement, Props>(function MessageRowInternal(
  {
    message,
    delay = false,
    isLast,
    isStreamingToolEvents,
    isReadOnly = false,
    synthesisStatus,
    className = '',
    onCopy,
    onRetry,
    onRegenerate,
    onToggleSynthesis,
    // New props
    handleSend,
    onRegenerateFromFlow,
  },
  ref
) {
  const breakpoint = useBreakpoint();

  const [isShowing, setIsShowing] = useState(false);
  const [isLongPressMenuOpen, setIsLongPressMenuOpen] = useState(false);

  // For showing thinking steps
  const { showSteps } = useSettingsStore();
  const [isStepsExpanded, setIsStepsExpanded] = useState(true);

  useEffect(() => {
    setIsStepsExpanded(showSteps);
  }, [showSteps]);

  const { data: experimentalFeatures } = useExperimentalFeatures();
  const { longPressProps } = useLongPress({
    onLongPress: () => setIsLongPressMenuOpen(true),
  });

  const getMessageText = () => {
    return isFulfilledMessage(message) ? message.originalText : message.text;
  };

  const hasSteps =
    (isFulfilledOrTypingMessage(message) ||
      isErroredMessage(message) ||
      isAbortedMessage(message)) &&
    !!message.toolEvents &&
    message.toolEvents.length > 0;

  const enableLongPress =
    (isFulfilledMessage(message) || isUserMessage(message)) && breakpoint === Breakpoint.sm;

  const isSynthesisEnabled =
    !!onToggleSynthesis &&
    !!experimentalFeatures?.USE_TEXT_TO_SPEECH_SYNTHESIS &&
    !!message.id &&
    isBotMessage(message) &&
    !isErroredMessage(message);

  const isRegenerationEnabled =
    isLast && !isReadOnly && isBotMessage(message) && !isErroredMessage(message);

  // Delay the appearance of the message to make it feel more natural.
  useEffect(() => {
    if (delay) {
      setTimeout(() => setIsShowing(true), 300);
    }
  }, []);

  if (delay && !isShowing) return null;

  return (
    <div className={cn('flex', className)} ref={ref}>
      <LongPressMenu
        isOpen={isLongPressMenuOpen}
        close={() => setIsLongPressMenuOpen(false)}
        className="md:hidden"
      >
        <div className="divide-marble-950' flex flex-col divide-y">
          <div className="flex flex-col gap-y-4 pt-4">
            <CopyToClipboardButton
              value={getMessageText()}
              label="Copy text"
              kind="secondary"
              iconAtStart
              onClick={onCopy}
            />
            {hasSteps && (
              <Button
                label={`${isStepsExpanded ? 'Hide' : 'Show'} steps`}
                icon="list"
                iconOptions={{ className: 'dark:fill-marble-800' }}
                kind="secondary"
                aria-label={`${isStepsExpanded ? 'Hide' : 'Show'} steps`}
                onClick={() => setIsStepsExpanded((prevIsExpanded) => !prevIsExpanded)}
              />
            )}
          </div>
        </div>
      </LongPressMenu>
      <div
        className={cn(
          'group flex h-fit w-full flex-col gap-2 rounded-md p-2 text-left md:flex-row',
          'transition-colors ease-in-out',
          'hover:bg-mushroom-950 dark:hover:bg-volcanic-150'
        )}
        {...(enableLongPress && longPressProps)}
      >
        <div className="flex w-full gap-x-2">
          <Avatar message={message} />
          <div className="flex w-full min-w-0 max-w-message flex-1 flex-col items-center gap-x-3 md:flex-row">
            <div className="w-full">
              {hasSteps && (
                <ToolEvents
                  show={isStepsExpanded}
                  events={message.toolEvents}
                  isStreaming={isStreamingToolEvents}
                  isLast={isLast}
                  // Pass the new props for regeneration
                  submitMessage={handleSend}
                  onRegenerateFromFlow={onRegenerateFromFlow}
                />
              )}

              <MessageContent isLast={isLast} message={message} onRetry={onRetry} />
            </div>
            <div
              className={cn('flex h-full items-end justify-end self-end', {
                'hidden md:invisible md:flex':
                  !isFulfilledMessage(message) && !isUserMessage(message),
                'hidden md:invisible md:flex md:group-hover:visible': !isLast,
              })}
            >
              {isSynthesisEnabled && (
                <IconButton
                  tooltip={{ label: synthesisStatus == SynthesisStatus.Playing ? 'Stop' : 'Read' }}
                  isLoading={synthesisStatus == SynthesisStatus.Loading}
                  iconName={synthesisStatus == SynthesisStatus.Playing ? 'stop' : 'volume'}
                  className="grid place-items-center rounded hover:bg-mushroom-900 dark:hover:bg-volcanic-200"
                  iconClassName={cn(
                    'text-volcanic-300 fill-volcanic-300 group-hover/icon-button:fill-mushroom-300',
                    'dark:fill-marble-800 dark:group-hover/icon-button:fill-marble-800'
                  )}
                  onClick={onToggleSynthesis}
                />
              )}
              {hasSteps && (
                <IconButton
                  tooltip={{ label: `${isStepsExpanded ? 'Hide' : 'Show'} steps`, size: 'sm' }}
                  iconName="list"
                  className="grid place-items-center rounded hover:bg-mushroom-900 dark:hover:bg-volcanic-200"
                  iconClassName={cn(
                    'text-volcanic-300 fill-volcanic-300 group-hover/icon-button:fill-mushroom-300',
                    'dark:fill-marble-800 dark:group-hover/icon-button:fill-marble-800'
                  )}
                  onClick={() => setIsStepsExpanded((prevIsExpanded) => !prevIsExpanded)}
                />
              )}
              {isRegenerationEnabled && (
                <IconButton
                  tooltip={{ label: 'Regenerate message' }}
                  iconName="regenerate"
                  className="grid place-items-center rounded hover:bg-mushroom-900 dark:hover:bg-volcanic-200"
                  iconClassName={cn(
                    'text-volcanic-300 fill-volcanic-300 group-hover/icon-button:fill-mushroom-300',
                    'dark:fill-marble-800 dark:group-hover/icon-button:fill-marble-800'
                  )}
                  onClick={onRegenerate}
                />
              )}
              <CopyToClipboardIconButton
                value={getMessageText()}
                hoverDelay={{ open: 250 }}
                onClick={onCopy}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
