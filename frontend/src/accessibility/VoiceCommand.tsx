import { useEffect } from "react";

type SpeechRecognitionConstructor = new () => {
  continuous: boolean;
  onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
  start: () => void;
  stop: () => void;
};

export function VoiceCommand({ onCommand }: { onCommand: (command: string) => void }) {
  useEffect(() => {
    const SpeechRecognition = (
      window as typeof window & { webkitSpeechRecognition?: SpeechRecognitionConstructor }
    ).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.onresult = (event) =>
      onCommand(event.results[event.results.length - 1][0].transcript.trim());
    recognition.start();
    return () => recognition.stop();
  }, [onCommand]);

  return null;
}
