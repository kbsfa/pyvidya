
import { useState, useEffect, useCallback, useRef } from 'react';

// FIX: Add type definitions for Speech Recognition API
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition; };
    webkitSpeechRecognition: { new (): SpeechRecognition; };
  }
}

// For browsers that support it, but might have vendor prefixes
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSTT = ({ lang = 'en-US' }: { lang?: string }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const recognition = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            setError('Speech recognition not supported by this browser.');
            return;
        }

        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        
        recognition.current.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(finalTranscript + interimTranscript);
        };

        recognition.current.onerror = (event) => {
            setError(event.error);
            setIsListening(false);
        };

        recognition.current.onend = () => {
            setIsListening(false);
        };

        // Cleanup
        return () => {
            recognition.current?.stop();
        };
    }, []);

    // Effect to update language if it changes
    useEffect(() => {
        if (recognition.current) {
            recognition.current.lang = lang;
        }
    }, [lang]);

    const startListening = useCallback(() => {
        if (recognition.current && !isListening) {
            setTranscript('');
            recognition.current.start();
            setIsListening(true);
            setError(null);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognition.current && isListening) {
            recognition.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return { isListening, transcript, startListening, stopListening, error, hasSupport: !!SpeechRecognition, setTranscript };
};