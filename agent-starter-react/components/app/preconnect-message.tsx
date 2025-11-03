'use client';

import { AnimatePresence, motion } from 'motion/react';
import { type ReceivedChatMessage } from '@livekit/components-react';
import { ShimmerText } from '@/components/livekit/shimmer-text';
import { cn } from '@/lib/utils';
import { easeOut } from 'motion';

const MotionMessage = motion.create('p');

const VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      transition: { ease: easeOut, duration: 0.3, delay: 0.2 }, // ✅ use easing function
    },
    hidden: {
      opacity: 0,
      transition: { ease: easeOut, duration: 0.3, delay: 0.2 },
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
};

interface PreConnectMessageProps {
  messages?: ReceivedChatMessage[];
  className?: string;
}

export function PreConnectMessage({ className, messages = [] }: PreConnectMessageProps) {
  return (
    <AnimatePresence>
      {messages.length === 0 && (
        <MotionMessage
          {...VIEW_MOTION_PROPS}
          aria-hidden={messages.length > 0}
          className={cn('pointer-events-none text-center', className)}
        >
          <ShimmerText className="text-sm font-semibold">
            Agent is listening, ask it a question
          </ShimmerText>
        </MotionMessage>
      )}
    </AnimatePresence>
  );
}
