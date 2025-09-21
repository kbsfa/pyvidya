
import React from 'react';

export const LoadingIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const RunCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

export const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export const ErrorIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        <path d="M10 4.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM10 14a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
);

export const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM9 11a1 1 0 112 0v6a1 1 0 11-2 0v-6zM4.343 5.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM1 11a1 1 0 102 0v-1a1 1 0 10-2 0v1zM15.293 15.293a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM16 11a1 1 0 102 0v-1a1 1 0 10-2 0v1zM6.707 15.293a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
    </svg>
);

export const ForwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.82,4.42a1,1,0,0,0-1-.22L15,5.08V3a1,1,0,0,0-1-1H6A1,1,0,0,0,5,3V5.08L3.18,4.2A1,1,0,0,0,2,5V12a1,1,0,0,0,.18.58L4,15.08V17a1,1,0,0,0,1,1H15a1,1,0,0,0,1-1V15.08l1.82-2.5A1,1,0,0,0,18,12V5a1,1,0,0,0-.18-.58ZM14,12.38,12,15V17H8V15L6,12.38V6H14Z" />
    </svg>
);

export const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm2 2a1 1 0 00-1 1v8a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H6z" clipRule="evenodd" />
    </svg>
);

export const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 6a.5.5 0 00-1 0v1.5a.5.5 0 001 0V6zM11.5 6a.5.5 0 00-1 0v1.5a.5.5 0 001 0V6zM9 11a1 1 0 11-2 0 1 1 0 012 0zm2-3a1 1 0 100 2 1 1 0 000-2z" />
      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 000 1h9a.5.5 0 000-1h-9z" clipRule="evenodd" />
    </svg>
);

export const StreakIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45.385c-.345.675-.5 1.425-.5 2.182V6.5a2.5 2.5 0 005 0V5.12c0-.757-.155-1.507-.5-2.182a1 1 0 00-1.45-.385c-.345.675-.5 1.425-.5 2.182V6.5a1.5 1.5 0 11-3 0V5.12c0-.757.155-1.507.5-2.182zM8.5 6.5a2.5 2.5 0 10-5 0V5.12c0-.757.155-1.507.5-2.182a1 1 0 011.45-.385c.345.675.5 1.425.5 2.182V6.5a1.5 1.5 0 103 0V5.12c0-.757-.155-1.507-.5-2.182a1 1 0 011.45-.385c.345.675.5 1.425.5 2.182v1.38A2.5 2.5 0 018.5 6.5zM12.5 11.5a2.5 2.5 0 10-5 0v1.38c0 .757.155 1.507.5 2.182a1 1 0 01-1.45.385c-.345-.675-.5-1.425-.5-2.182v-1.38a1.5 1.5 0 10-3 0v1.38c0 .757.155 1.507.5 2.182a1 1 0 01-1.45.385c-.345-.675-.5-1.425-.5-2.182V11.5a2.5 2.5 0 015 0v1.38c0 .757-.155 1.507-.5 2.182a1 1 0 001.45.385c.345-.675.5-1.425.5-2.182v-1.38z" clipRule="evenodd" />
    </svg>
);


export const MuteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const MicrophoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93V17h-2v-2.07A6.98 6.98 0 013 11a1 1 0 112 0 5 5 0 009.68 1.05A1 1 0 1117 11c0 2.9-2.04 5.33-4.71 6.07z" clipRule="evenodd" />
    </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

export const PanelLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
);

export const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.5l.053.053a.5.5 0 010 .707l-.053.053a.5.5 0 01-.707 0l-.053-.053a.5.5 0 010-.707l.053-.053a.5.5 0 01.707 0zM12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);