import { useState, useEffect, useCallback, useRef } from 'react';

export const useTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    const preferredVoice = useRef<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);

            const getVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    const femaleVoices = voices.filter(voice =>
                        voice.lang.startsWith('en') &&
                        /female/i.test(voice.name)
                    );
                    
                    // Voice preference order from spec
                    const voicePreferences = [
                        /Samantha/i, /Victoria/i, /Zira/i, /Google US English/i
                    ];

                    for (const preference of voicePreferences) {
                        const found = femaleVoices.find(v => preference.test(v.name));
                        if (found) {
                            preferredVoice.current = found;
                            return;
                        }
                    }
                    // Fallback to the first available English female voice
                    preferredVoice.current = femaleVoices[0] || voices.find(v => v.lang.startsWith('en-US')) || voices[0];
                }
            };

            getVoices();
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = getVoices;
            }
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!supported || !text) return;

        window.speechSynthesis.cancel(); // Cancel any previous speech

        const utterance = new SpeechSynthesisUtterance(text);
        if (preferredVoice.current) {
            utterance.voice = preferredVoice.current;
        }
        utterance.rate = 0.9; // Spec: ~0.85
        utterance.pitch = 1.2; // Spec: ~1.2

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const cancel = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [supported]);

    return { isSpeaking, supported, speak, cancel };
};
