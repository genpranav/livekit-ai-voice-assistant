'use client';

import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import { easeOut } from 'motion';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { ChatEntry } from '@/components/livekit/chat-entry';

const CONTAINER_MOTION_PROPS = {
  variants: {
    hidden: {
      opacity: 0,
      transition: {
        ease: easeOut,
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        ease: easeOut,
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: 1,
      },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
} satisfies Omit<HTMLMotionProps<'div'>, 'ref'>;

const MESSAGE_MOTION_PROPS = {
  variants: {
    hidden: { opacity: 0, translateY: 10 },
    visible: { opacity: 1, translateY: 0 },
  },
};

interface ChatTranscriptProps {
  hidden?: boolean;
  messages?: ReceivedChatMessage[];
}

export function ChatTranscript({
  hidden = false,
  messages = [],
  ...rest
}: ChatTranscriptProps & Omit<HTMLMotionProps<'div'>, 'ref'>) {
  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div {...CONTAINER_MOTION_PROPS} {...rest}>
          {messages.map(
            ({
              id,
              timestamp,
              from,
              message,
              editTimestamp,
            }: ReceivedChatMessage) => {
              const locale = navigator?.language ?? 'en-US';
              const messageOrigin = from?.isLocal ? 'local' : 'remote';

              return (
                <motion.div
                  key={id}
                  {...MESSAGE_MOTION_PROPS}
                >
                  <ChatEntry
                    locale={locale}
                    timestamp={timestamp}
                    message={message}
                    messageOrigin={messageOrigin}
                    hasBeenEdited={!!editTimestamp}
                  />
                </motion.div>
              );
            }
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
