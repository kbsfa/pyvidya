
import { useState, useEffect, useCallback } from 'react';

export const useTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);
    
    // The voices list is now fetched on-demand in the speak function,
    // so we don't need to store it in state, which avoids race conditions.
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setSupported(true);
            // Pre-warm the voice list on mount.
            window.speechSynthesis.getVoices();
        }
    }, []);

    const speak = useCallback((text: string, lang: string = 'en-US') => {
        if (!supported || !text) return;

        // FIX: Get voices at the moment of speaking to avoid race conditions
        // where the voice list hasn't populated yet.
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length === 0) {
            console.warn("TTS voices not loaded yet. Cannot speak.");
            // Retry once after a short delay, as browsers sometimes take a moment.
            setTimeout(() => speak(text, lang), 250);
            return;
        }

        window.speechSynthesis.cancel(); // Cancel any previous speech

        // Find the best voice for the requested language
        // First, try for an exact match (e.g., 'ta-IN')
        let selectedVoice = availableVoices.find(v => v.lang === lang);
        // If not found, try for a primary language match (e.g., 'ta' for 'ta-IN')
        if (!selectedVoice) {
            selectedVoice = availableVoices.find(v => v.lang.startsWith(lang.split('-')[0]));
        }
        
        if (!selectedVoice) {
            console.warn(`No TTS voice found for language: ${lang}. Speech synthesis cancelled.`);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
        utterance.rate = 0.9;
        utterance.pitch = 1.2;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            console.error(`Speech synthesis error for lang=${lang}:`, event.error);
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const cancel = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, [supported]);

    return { isSpeaking, supported, speak, cancel };
};
