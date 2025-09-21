

import { useState, useEffect, useCallback } from 'react';

// FIX: Create a union type to handle both custom hook errors and browser speech synthesis errors.
type TTSErrorEvent = SpeechSynthesisErrorEvent | { error: string };

interface SpeakCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (event: TTSErrorEvent) => void;
}

interface SpeakOptions {
  lang?: string;
  femaleVoicePreferred?: boolean;
  callbacks?: SpeakCallbacks;
}

export const useTTS = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [voicesLoaded, setVoicesLoaded] = useState(false);

    // This effect handles the asynchronous loading of speech synthesis voices.
    // It's the definitive solution to the race condition by using the browser's
    // official event listener for when the voice list is ready.
    useEffect(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            return;
        }

        const handleVoicesChanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            // Only update state if the browser actually returns voices.
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                setVoicesLoaded(true);
            }
        };
        
        // Add the event listener for when voices change.
        window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
        
        // Initial load: The voices might already be loaded on mount, so we check.
        handleVoicesChanged();

        // Cleanup: remove the event listener when the component unmounts.
        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);


    const speak = useCallback((text: string, options: SpeakOptions = {}): boolean => {
        const { lang = 'en-US', femaleVoicePreferred = true, callbacks } = options;

        if (!text || voices.length === 0) {
            if (voices.length === 0) {
                console.warn("TTS voices not loaded yet. Cannot speak.");
            }
             // Synchronously call onError so the caller can react immediately.
            callbacks?.onError?.({ error: 'tts-not-ready' });
            return false;
        }

        const normalizeLang = (langCode: string) => langCode.replace('_', '-').toLowerCase();
        const normalizedLang = normalizeLang(lang); // e.g., 'ta-in'
        const langPrefix = normalizedLang.split('-')[0]; // e.g., 'ta'

        // New more robust check for female voices
        const isFemale = (voice: SpeechSynthesisVoice) => {
            const name = voice.name.toLowerCase();
            // Generic check first for names that explicitly state "Female"
            if (name.includes('female')) return true;
            
            // Check for common non-gendered but female names/keywords from various platforms
            // This makes the selection much more reliable across different browsers/OS
            const knownFemaleKeywords = [
                'zira',     // Microsoft
                'susan',    // Apple
                'samantha', // Apple
                'victoria', // Apple
                'tessa',    // Apple
                'karen',    // Apple
                'moira',    // Apple
                'serena',   // Microsoft
                'fiona'     // macOS
            ];
            
            return knownFemaleKeywords.some(keyword => name.includes(keyword));
        };

        // Create a prioritized list of search functions based on preference.
        const searchPriorities = femaleVoicePreferred ? [
            (v: SpeechSynthesisVoice) => normalizeLang(v.lang) === normalizedLang && isFemale(v), // 1. Exact match, female
            (v: SpeechSynthesisVoice) => normalizeLang(v.lang) === normalizedLang,                 // 2. Exact match, any
            (v: SpeechSynthesisVoice) => normalizeLang(v.lang).startsWith(langPrefix) && isFemale(v), // 3. Lang prefix, female
            (v: SpeechSynthesisVoice) => normalizeLang(v.lang).startsWith(langPrefix),              // 4. Lang prefix, any
        ] : [
            (v: SpeechSynthesisVoice) => normalizeLang(v.lang) === normalizedLang,                 // 1. Exact match, any
            (v: SpeechSynthesisVoice) => normalizeLang(v.lang).startsWith(langPrefix),              // 2. Lang prefix, any
        ];

        let selectedVoice: SpeechSynthesisVoice | undefined;

        // Iterate through priorities to find the best available voice.
        for (const findVoice of searchPriorities) {
            selectedVoice = voices.find(findVoice);
            if (selectedVoice) {
                break; // Found the best match, stop searching.
            }
        }
        
        if (!selectedVoice) {
            console.warn(`No TTS voice found for language: ${lang}. Speech synthesis cancelled.`);
            console.log('Available voices for debugging:', voices.map(v => ({ name: v.name, lang: v.lang })));
            // Synchronously call onError
            callbacks?.onError?.({ error: 'voice-not-found' });
            return false;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang; // Use the voice's lang for consistency
        utterance.rate = 0.9;
        utterance.pitch = 1.2;

        utterance.onstart = () => {
            setIsSpeaking(true);
            callbacks?.onStart?.();
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            callbacks?.onEnd?.();
        };
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            // The 'interrupted' error is expected when we call `cancel()` to stop speech
            // prematurely (e.g., user runs code). It's not a true error state.
            if (event.error === 'interrupted') {
                console.log(`Speech synthesis interrupted for lang=${lang}. This is expected.`);
            } else {
                console.error(`Speech synthesis error for lang=${lang}, voice=${selectedVoice?.name}:`, event.error);
            }
            setIsSpeaking(false);
            callbacks?.onError?.(event);
        };

        window.speechSynthesis.speak(utterance);
        return true;
    }, [voices]); // The speak function now depends on the voices state.

    const cancel = useCallback(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);
    
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    return { isSpeaking, supported, speak, cancel, voicesLoaded };
};
