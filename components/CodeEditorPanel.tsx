import React from 'react';
import type { LastRun } from '../types';
import { LoadingIcon, RunCodeIcon } from './Icons';

interface CodeEditorPanelProps {
  code: string;
  onCodeChange: (newCode: string) => void;
  onRunCode: () => void;
  pyodideLoaded: boolean;
  lastRun: LastRun;
  isDirty: boolean;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  onCodeChange,
  onRunCode,
  pyodideLoaded,
  lastRun,
  isDirty,
}) => {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      onRunCode();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-full shadow-lg">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <h2 className="text-xl font-bold text-green-500">Code Editor</h2>
        <button
          onClick={onRunCode}
          disabled={!pyodideLoaded}
          className={`px-4 py-2 rounded-lg font-bold flex items-center transition-all duration-200 ${
            !pyodideLoaded
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isDirty
              ? 'bg-yellow-500 text-gray-900 animate-pulse'
              : 'bg-green-500 hover:bg-green-600 text-gray-900'
          }`}
        >
          {!pyodideLoaded ? <LoadingIcon /> : <RunCodeIcon />}
          <span className="ml-2">{!pyodideLoaded ? 'Loading...' : isDirty ? 'Run Changes' : 'Run Code'}</span>
        </button>
      </div>
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow w-full bg-gray-900 text-cyan-500 p-3 rounded-md font-mono border-2 border-gray-700 focus:border-magenta-500 focus:outline-none resize-none"
        spellCheck="false"
        placeholder="Your Python code goes here..."
      />
      <div className="mt-4 flex-shrink-0">
        <h3 className="text-lg font-bold text-yellow-500">Output</h3>
        <div className="bg-gray-900 mt-2 p-3 rounded-md min-h-[100px] font-mono text-sm border border-gray-700">
          {lastRun.timestamp === null ? (
            <p className="text-gray-600">Click "Run Code" to see the output here.</p>
          ) : lastRun.success ? (
            <pre className="text-gray-300 whitespace-pre-wrap">{lastRun.stdout || <span className="text-gray-500">(No output)</span>}</pre>
          ) : (
            <pre className="text-red-500 whitespace-pre-wrap">{lastRun.stderr}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
