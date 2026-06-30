import { useEffect } from "react";

export function TextToSpeech({ text, enabled }: { text: string; enabled: boolean }) {
  useEffect(() => {
    if (!enabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    return () => window.speechSynthesis.cancel();
  }, [enabled, text]);

  return null;
}
