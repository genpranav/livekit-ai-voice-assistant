'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRoomContext } from '@livekit/components-react';
import { useSession } from '@/components/app/session-provider';
import { useChatMessages } from '@/hooks/useChatMessages';
import { TileLayout } from '@/components/app/tile-layout';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatTranscript } from '@/components/app/chat-transcript';
import { PreConnectMessage } from '@/components/app/preconnect-message';
import { Button } from '@/components/livekit/button';
import { ScrollArea } from '@/components/livekit/scroll-area/scroll-area';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ViewController() {
  const room = useRoomContext();
  const { appConfig, isSessionActive, startSession, endSession } = useSession();
  const messages = useChatMessages();

  const [chatOpen, setChatOpen] = useState(false);
  const [latestMessage, setLatestMessage] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // update latest message overlay
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages.at(-1);
      if (last?.message) {
        setLatestMessage(last.message);
        const timer = setTimeout(() => setLatestMessage(null), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [messages]);

  // autoscroll for chat transcript
  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;
    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // graceful disconnect
  useEffect(() => {
    if (!isSessionActive && room.state !== 'disconnected') {
      room.disconnect();
    }
  }, [isSessionActive, room]);

  const handleClick = () => {
    if (isSessionActive) endSession();
    else startSession();
  };

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  return (
    <>
      {/* Floating Control Section */}
      <section className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
        <motion.div layout className="relative flex flex-col items-center justify-center" transition={{ duration: 0.2 }}>
          {/* Fading Transcription Preview Bubble */}
          <AnimatePresence>
            {latestMessage && (
              <motion.div
                key={latestMessage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  'absolute bottom-[90px] max-w-xs text-center text-sm font-mono text-white bg-black/70 px-3 py-2 rounded-lg shadow-lg backdrop-blur-md pointer-events-none'
                )}
                style={{ zIndex: 10 }}
              >
                {latestMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start / End Call Button or Agent Controls */}
          {!isSessionActive ? (
            <Button
              onClick={handleClick}
              variant="primary"
              size="lg"
              className="font-mono shadow-lg rounded-full px-6 py-3"
            >
              {appConfig.startButtonText}
            </Button>
          ) : (
            <motion.div
              key="active-controls"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-background rounded-2xl shadow-xl p-3"
              style={{ zIndex: 50 }}
            >
              <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Waveform + Assistant Image + Transcript */}
      <AnimatePresence>
        {isSessionActive && (
          <motion.div
            key="waveform-area"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-end"
          >
            {/* Assistant image */}
            <div className="mb-3 pointer-events-none">
              <Image
                src="/voice-assistant.jpg"
                alt="Voice Assistant"
                width={120}
                height={120}
                className="rounded-full shadow-md border border-gray-300"
              />
            </div>

            {/* Chat Transcript overlay (scrollable) */}
            <div
              className={cn(
                'fixed inset-0 grid grid-cols-1 grid-rows-1 transition-opacity duration-300',
                !chatOpen && 'opacity-0 pointer-events-none'
              )}
            >
              {/* fade top and bottom overlays */}
              <div className="absolute inset-x-4 top-0 h-40 bg-gradient-to-b from-background to-transparent pointer-events-none" />
              <ScrollArea ref={scrollAreaRef} className="px-4 pt-40 pb-[150px] md:px-6 md:pb-[180px]">
                <ChatTranscript
                  hidden={!chatOpen}
                  messages={messages}
                  className="mx-auto max-w-2xl space-y-3 transition-opacity duration-300 ease-out"
                />
              </ScrollArea>
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* Waveform layout */}
            <div className="w-full max-w-[1100px] px-4 md:px-8 mb-28 pointer-events-none">
              <TileLayout chatOpen={chatOpen} />
            </div>

            {/* PreConnect + bottom fade area (optional) */}
            {appConfig.isPreConnectBufferEnabled && (
              <PreConnectMessage messages={messages} className="pb-4" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
