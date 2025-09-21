import React, { useEffect } from 'react';
import type { PyvidhyaResponse, PyvidhyaAction } from '../types';
import { LoadingIcon, RunCodeIcon, MuteIcon, MicrophoneIcon, SendIcon } from './Icons';

interface AIAssistantPanelProps {
  response: PyvidhyaResponse;
  isTyping: boolean;
  onAction: (action: PyvidhyaAction) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  setTranscript: (text: string) => void;
  onSend: (message: string) => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
    response, isTyping, onAction, isSpeaking, onStopSpeaking,
    isListening, startListening, stopListening, transcript, setTranscript, onSend
}) => {

    useEffect(() => {
        if (!isListening && transcript) {
            onSend(transcript);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isListening]);


    const handleSend = () => {
        if (transcript.trim()) {
            onSend(transcript.trim());
            setTranscript('');
        }
    };

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };
    
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full shadow-lg">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-bold text-magenta-500">Pyvidhya's Guidance</h2>
        {isSpeaking && (
          <button onClick={onStopSpeaking} className="flex items-center bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition-colors">
            <MuteIcon />
            <span className="ml-2">Stop Speaking</span>
          </button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-2 mb-4">
        {isTyping && !response.readingContent ? (
          <div className="flex items-center justify-center h-full text-cyan-500">
            <LoadingIcon />
            <p className="ml-2">Pyvidhya is typing...</p>
          </div>
        ) : (
          <div 
            className="prose prose-invert text-gray-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: response.readingContent }}
          />
        )}
         {isTyping && response.readingContent && (
            <div className="flex items-center text-cyan-500 mt-4">
              <LoadingIcon />
              <p className="ml-2">Pyvidhya is typing...</p>
            </div>
         )}
      </div>
       {response.actions?.length > 0 && !isTyping && (
        <div className="mb-4 flex-shrink-0 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-cyan-500 mb-2">Suggested Actions</h3>
          <div className="flex gap-2">
            {response.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors"
              >
                {action.type === 'nudgeRunCode' && <RunCodeIcon />}
                <span className="ml-2">{action.payload?.message || action.type}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex-shrink-0 border-t border-gray-700 pt-4">
        <div className="flex items-center gap-2">
            <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                placeholder={isListening ? "Listening..." : "Ask Pyvidhya a question..."}
                className="flex-grow bg-gray-900 text-cyan-500 p-2 rounded-md font-mono border-2 border-gray-700 focus:border-magenta-500 focus:outline-none resize-none"
                rows={2}
                disabled={isTyping}
            />
            <button
                onClick={handleMicClick}
                className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={isTyping}
            >
                <MicrophoneIcon className="text-white" />
            </button>
            <button
                onClick={handleSend}
                className="p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                disabled={isTyping || !transcript.trim()}
            >
                <SendIcon className="text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
