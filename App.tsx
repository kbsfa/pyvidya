
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AppContext, LastRun, PyvidhyaAction, Test, PyvidhyaResponse } from './types';
import { getPyvidhyaResponse } from './services/geminiService';
import { usePyodide } from './hooks/usePyodide';
import { useTTS } from './hooks/useTTS';
import { useSTT } from './hooks/useSTT';
import AIAssistantPanel from './components/AIAssistantPanel';
import CodeEditorPanel from './components/CodeEditorPanel';
import SidePanel from './components/SidePanel';
import { initialContext, initialResponse } from './constants';
import { LoadingIcon, CoinIcon, StreakIcon, PanelLeftIcon, GlobeIcon } from './components/Icons';
import { getCurriculumSlice, curriculum } from './curriculum';

const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'bn-IN', name: 'বাংলা (Bengali)' },
    { code: 'mr-IN', name: 'मराठी (Marathi)' },
    { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
];

export default function App() {
  const [context, setContext] = useState<AppContext>(initialContext);
  const [pyvidhyaResponse, setPyvidhyaResponse] = useState<PyvidhyaResponse>(initialResponse);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPyvidhyaTyping, setIsPyvidhyaTyping] = useState<boolean>(false);
  
  // FIX: Added state to manage user interaction for TTS autoplay policy
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const initialGreetingToSpeak = useRef<{ content: string; lang: string } | null>(null);

  const { pyodideLoaded, runPython } = usePyodide();
  const { isSpeaking, speak, cancel } = useTTS();
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSTT({ lang: context.ui.language });
  const editorDirtyTimer = useRef<number | null>(null);
  
  const prevLessonRef = useRef({ chapter: 0, episode: 0 });

  const triggerPyvidhyaResponse = useCallback(async (userInput: string, immediateUpdates: Partial<AppContext> = {}) => {
    if (isPyvidhyaTyping) return;
    cancel();
    setIsPyvidhyaTyping(true);

    const updatedContext = {
      ...context,
      ...immediateUpdates,
      chatTurns: context.chatTurns + 1,
      historyShort: `${context.historyShort}\nUser: ${userInput}`.slice(-1000)
    };
    setContext(updatedContext);

    try {
      const response = await getPyvidhyaResponse(updatedContext, userInput);
      setPyvidhyaResponse(response);
      if (response.rubric && response.rubric.stage !== updatedContext.stage) {
          setContext(prev => ({
              ...prev,
              stage: response.rubric.stage,
              objectives: response.rubric.successCriteria || prev.objectives
          }));
      }
    } catch (error) {
      console.error("Error from Pyvidhya:", error);
    } finally {
      setIsPyvidhyaTyping(false);
    }
  }, [context, isPyvidhyaTyping, cancel]);

  // This effect handles speaking for all responses *after* the initial one.
  useEffect(() => {
    if (pyvidhyaResponse.speakingContent && !isPyvidhyaTyping && context.ui.ttsEnabled && hasUserInteracted && !isLoading) {
      speak(pyvidhyaResponse.speakingContent, context.ui.language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pyvidhyaResponse, isPyvidhyaTyping, context.ui.ttsEnabled, context.ui.language, hasUserInteracted, isLoading]);

  useEffect(() => {
    const hasNavigated = prevLessonRef.current.chapter !== context.chapterIndex || prevLessonRef.current.episode !== context.episodeIndex;
    
    if (hasNavigated && !isLoading) {
      triggerPyvidhyaResponse(`System: User is navigating to Chapter ${context.chapterIndex + 1}, Episode ${context.episodeIndex + 1}: "${context.episodeTitle}". Please provide a greeting for this new lesson.`);
    }

    prevLessonRef.current = { chapter: context.chapterIndex, episode: context.episodeIndex };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.chapterIndex, context.episodeIndex, isLoading]);

  // FIX: This effect now captures the initial greeting but doesn't speak it.
  const fetchInitialGreeting = useCallback(async () => {
    setIsPyvidhyaTyping(true);
    try {
      const response = await getPyvidhyaResponse(context, "The user has just loaded the application. Please provide a warm welcome and introduce the first lesson.");
      setPyvidhyaResponse(response);
      // Store the initial greeting to be spoken after user interaction.
      initialGreetingToSpeak.current = { content: response.speakingContent, lang: context.ui.language };
    } catch (error) {
      console.error("Error fetching initial greeting:", error);
    } finally {
      setIsLoading(false);
      setIsPyvidhyaTyping(false);
    }
  }, [context]);

  useEffect(() => {
    fetchInitialGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FIX: This effect handles the user interaction gate for the first speech.
  useEffect(() => {
    const unlockAudio = () => {
        setHasUserInteracted(true);
    };
    
    // Add event listeners that are removed after the first interaction
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // FIX: This effect speaks the initial greeting once audio is unlocked.
  useEffect(() => {
      if (hasUserInteracted && initialGreetingToSpeak.current && context.ui.ttsEnabled) {
          speak(initialGreetingToSpeak.current.content, initialGreetingToSpeak.current.lang);
          initialGreetingToSpeak.current = null; // Ensure it only runs once
      }
  }, [hasUserInteracted, context.ui.ttsEnabled, speak]);


  const resetInactivity = useCallback(() => {
    setContext(prev => ({ ...prev, userSignals: { ...prev.userSignals, inactiveForSec: 0 } }));
  }, []);

  const toggleAIPanel = useCallback(() => {
    setContext(prev => ({
        ...prev,
        ui: {
            ...prev.ui,
            chatCollapsed: !prev.ui.chatCollapsed,
        }
    }));
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      cancel();
      setContext(prev => ({
          ...prev,
          ui: {
              ...prev.ui,
              language: e.target.value,
          }
      }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setContext(prev => ({ ...prev, userSignals: { ...prev.userSignals, inactiveForSec: prev.userSignals.inactiveForSec + 1 }, timeOnEpisodeSec: prev.timeOnEpisodeSec + 1 }));
    }, 1000);

    const handleInteraction = (e: Event) => {
        if((e as KeyboardEvent).ctrlKey && (e as KeyboardEvent).key === 'm') {
            e.preventDefault();
            toggleAIPanel();
        } else {
            resetInactivity();
        }
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [resetInactivity, toggleAIPanel]);
  
  useEffect(() => {
    if (context.userSignals.inactiveForSec === 30 && !isPyvidhyaTyping) {
      triggerPyvidhyaResponse("System: User has been inactive for 30 seconds. Gently check in.");
    } else if (context.userSignals.inactiveForSec === 120 && !isPyvidhyaTyping) {
      triggerPyvidhyaResponse("System: User has been inactive for 2 minutes. Offer a hint or a micro-goal.");
    }
  }, [context.userSignals.inactiveForSec, isPyvidhyaTyping, triggerPyvidhyaResponse]);

  const handleCodeChange = (newCode: string) => {
    resetInactivity();
    setContext(prev => ({ ...prev, editorCode: newCode, editorDirtySinceMs: 0 }));
    if (editorDirtyTimer.current) clearTimeout(editorDirtyTimer.current);
    editorDirtyTimer.current = window.setTimeout(() => {
        setContext(prev => ({ ...prev, editorDirtySinceMs: 2500 }));
        if(!isPyvidhyaTyping) triggerPyvidhyaResponse("System: User has changed the code but not run it. Nudge them to run it.");
    }, 2500);
  };

  const checkSuccessCriteria = (output: string, tests: Test[]): boolean => {
    if (!tests || tests.length === 0) return true;
    return tests.every(test => 
        test.expect.every(substring => {
            if (substring === "") return true;
            return output.includes(substring);
        })
    );
  }

  const handleRunCode = async () => {
    resetInactivity();
    if (editorDirtyTimer.current) {
      clearTimeout(editorDirtyTimer.current);
      editorDirtyTimer.current = null;
    }
    const result = await runPython(context.editorCode);
    const lastRunResult: LastRun = {
      timestamp: Date.now(),
      stdout: result.stdout,
      stderr: result.stderr,
      success: result.success,
      durationMs: result.durationMs,
    };
    
    const contextUpdates: Partial<AppContext> = {
      lastRun: lastRunResult,
      attempts: context.attempts + 1,
      editorDirtySinceMs: 0,
      recentErrors: result.success ? context.recentErrors : [...context.recentErrors, { message: result.stderr, line: 0, col: 0, attemptIndex: context.attempts + 1 }].slice(-5)
    };

    let promptForAI = "System: User ran the code.";
    if (lastRunResult.success) {
      const testsPassed = checkSuccessCriteria(lastRunResult.stdout, context.curriculumSlice.tests);
      if (testsPassed) {
        promptForAI = "System: User ran the code and all success criteria have been met successfully. Please celebrate and suggest advancing.";
      }
    } else {
        promptForAI = "System: User ran the code and it resulted in an error. Please diagnose it."
    }
    triggerPyvidhyaResponse(promptForAI, contextUpdates);
  };
  
  const navigateLesson = (direction: 'next' | 'prev') => {
      let newChapterIndex = context.chapterIndex;
      let newEpisodeIndex = context.episodeIndex;

      const currentChapterData = curriculum[newChapterIndex];
      if (!currentChapterData) return;
      const maxEpisodesInCurrentChapter = Object.keys(currentChapterData.episodes).length;

      if (direction === 'next') {
          if (newEpisodeIndex < maxEpisodesInCurrentChapter - 1) {
              newEpisodeIndex++;
          } else {
              const nextChapterIndex = newChapterIndex + 1;
              if (curriculum[nextChapterIndex]) {
                  newChapterIndex = nextChapterIndex;
                  newEpisodeIndex = 0;
              } else { return; }
          }
      } else { // prev
          if (newEpisodeIndex > 0) {
              newEpisodeIndex--;
          } else {
              const prevChapterIndex = newChapterIndex - 1;
              if (curriculum[prevChapterIndex]) {
                  newChapterIndex = prevChapterIndex;
                  newEpisodeIndex = Object.keys(curriculum[prevChapterIndex].episodes).length - 1;
              } else { return; }
          }
      }
      
      const newSlice = getCurriculumSlice(newChapterIndex, newEpisodeIndex);
      const newEditorCode = newSlice.stageContent?.discover?.codeSample || "# Welcome!";
      
      const nextChapterExists = !!curriculum[newChapterIndex + 1] || newEpisodeIndex < Object.keys(curriculum[newChapterIndex].episodes).length - 1;
      const prevChapterExists = !!curriculum[newChapterIndex - 1] || newEpisodeIndex > 0;

      const newContext: AppContext = {
          ...context,
          chapterIndex: newChapterIndex,
          episodeIndex: newEpisodeIndex,
          chapterTitle: curriculum[newChapterIndex].title,
          episodeTitle: curriculum[newChapterIndex].episodes[newEpisodeIndex].title,
          stage: 'discover',
          curriculumSlice: {
              stageContent: newSlice.stageContent ?? {},
              practiceBlanks: newSlice.practiceBlanks ?? [],
              tests: newSlice.tests ?? [],
          },
          editorCode: newEditorCode,
          editorDirtySinceMs: 0,
          lastRun: initialContext.lastRun,
          attempts: 0,
          timeOnEpisodeSec: 0,
          hintsUsed: 0,
          chatTurns: 0,
          historyShort: "The user has just started a new lesson.",
          navHints: {
              hasNextEpisode: nextChapterExists,
              hasPrevEpisode: prevChapterExists,
              hasNextStage: true,
              hasPrevStage: false,
          }
      };
      setContext(newContext);
  };

  const handleAction = (action: PyvidhyaAction) => {
      resetInactivity();
      switch(action.type) {
        case 'nudgeRunCode':
          break;
        case 'advanceStage':
          const stages: AppContext['stage'][] = ['discover', 'explore', 'practice', 'apply', 'master'];
          const currentStageIndex = stages.indexOf(context.stage);
          if (currentStageIndex < stages.length - 1) {
              const nextStage = stages[currentStageIndex + 1];
              setContext(prev => ({ ...prev, stage: nextStage }));
              triggerPyvidhyaResponse(`System: User is advancing to the ${nextStage} stage.`);
          }
          break;
        case 'awardCoins':
            setContext(prev => ({
                ...prev,
                progress: {
                    ...prev.progress,
                    coins: prev.progress.coins + (action.payload.coins || 0)
                }
            }));
            break;
        default:
          console.log(`Unhandled action type: ${action.type}`, action.payload);
      }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-cyan-500">
        <LoadingIcon />
        <p className="ml-4 text-xl">Waking up Pyvidhya...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col p-4 gap-4 font-mono">
      <header className="flex-shrink-0 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-magenta-500">Pyvidhya: AI Python Teacher</h1>
            <p className="text-sm text-gray-600">Chapter {context.chapterIndex + 1}: {context.chapterTitle} - Episode {context.episodeIndex + 1}: {context.episodeTitle}</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="relative group">
                <GlobeIcon />
                <select 
                    value={context.ui.language} 
                    onChange={handleLanguageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                    {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center bg-gray-800 p-2 rounded-lg">
                <StreakIcon />
                <span className="ml-2 text-red-500 font-bold text-lg">{context.progress.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center bg-gray-800 p-2 rounded-lg">
                <CoinIcon />
                <span className="ml-2 text-yellow-500 font-bold text-lg">{context.progress.coins}</span>
            </div>
            <button 
                onClick={toggleAIPanel} 
                title="Toggle AI Panel (Ctrl+M)" 
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <PanelLeftIcon />
            </button>
        </div>
      </header>
      <main className="flex-grow grid grid-cols-12 gap-4 min-h-0">
        <div className={`min-h-0 transition-all duration-300 ${context.ui.chatCollapsed ? 'hidden' : 'col-span-12 lg:col-span-4'}`}>
          <AIAssistantPanel 
            response={pyvidhyaResponse} 
            isTyping={isPyvidhyaTyping} 
            onAction={handleAction}
            isSpeaking={isSpeaking}
            onStopSpeaking={cancel}
            isListening={isListening}
            startListening={startListening}
            stopListening={stopListening}
            transcript={transcript}
            setTranscript={setTranscript}
            onSend={triggerPyvidhyaResponse}
          />
        </div>
        <div className={`flex flex-col gap-4 min-h-0 col-span-12 ${context.ui.chatCollapsed ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
          <CodeEditorPanel
            code={context.editorCode}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            pyodideLoaded={pyodideLoaded}
            lastRun={context.lastRun}
            isDirty={context.editorDirtySinceMs > 0}
          />
        </div>
        <div className={`min-h-0 col-span-12 ${context.ui.chatCollapsed ? 'lg:col-span-5' : 'lg:col-span-3'}`}>
          <SidePanel response={pyvidhyaResponse} context={context} onNavigate={navigateLesson} />
        </div>
      </main>
    </div>
  );
}
