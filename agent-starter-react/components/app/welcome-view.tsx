import { Button } from '@/components/livekit/button';

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref}>
      <section className="fixed bottom-6 right-6">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartCall}
          className="font-mono shadow-lg rounded-full px-6 py-3"
        >
          {startButtonText}
        </Button>
      </section>
    </div>
  );
};
