import { useState, useCallback } from 'react';

export function useVoice(onResult: (result: string) => void, language: string = 'en') {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Map application language to speech recognition language
    switch (language) {
      case 'ml':
        recognition.lang = 'ml-IN';
        break;
      case 'hi':
        recognition.lang = 'hi-IN';
        break;
      case 'bn':
        recognition.lang = 'bn-IN';
        break;
      case 'kn':
        recognition.lang = 'kn-IN';
        break;
      default:
        recognition.lang = 'en-US';
    }

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  }, [onResult, language]);

  return { isListening, error, startListening };
}
