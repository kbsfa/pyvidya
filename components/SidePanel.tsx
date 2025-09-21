import React, { useState } from 'react';
import type { AppContext, PyvidhyaResponse } from '../types';
import { CheckIcon, ErrorIcon, TargetIcon, LightbulbIcon, ForwardIcon, TrophyIcon, BookIcon } from './Icons';
import { curriculum } from '../curriculum';

interface SidePanelProps {
  response: PyvidhyaResponse;
  context: AppContext;
  onNavigate: (direction: 'next' | 'prev') => void;
}

const PanelCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-4">
        <h3 className="text-lg font-bold text-cyan-500 mb-3 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        {children}
    </div>
);

const SyllabusView: React.FC<{ currentChapter: number; currentEpisode: number; }> = ({ currentChapter, currentEpisode }) => (
    <div className="space-y-2">
        {Object.entries(curriculum).map(([chapterKey, chapterData]) => (
            <div key={chapterKey}>
                <h4 className="font-bold text-gray-400">Chapter {parseInt(chapterKey) + 1}: {chapterData.title}</h4>
                <ul className="pl-4">
                    {Object.entries(chapterData.episodes).map(([episodeKey, episodeData]) => {
                        const isCurrent = parseInt(chapterKey) === currentChapter && parseInt(episodeKey) === currentEpisode;
                        return (
                            <li key={episodeKey} className={`text-sm ${isCurrent ? 'text-magenta-500 font-bold' : 'text-gray-500'}`}>
                                Ep {parseInt(episodeKey) + 1}: {episodeData.title}
                            </li>
                        );
                    })}
                </ul>
            </div>
        ))}
    </div>
);


const SidePanel: React.FC<SidePanelProps> = ({ response, context, onNavigate }) => {
  const { rubric, checklist, nextStep } = response;
  const [showSyllabus, setShowSyllabus] = useState(false);
  
  return (
    <div className="h-full flex flex-col overflow-y-auto pr-2">
       <PanelCard title="Lesson Navigation" icon={<BookIcon />}>
            <div className="flex justify-between items-center mb-2">
                 <button onClick={() => setShowSyllabus(!showSyllabus)} className="text-sm text-blue-500 hover:underline">
                    {showSyllabus ? "Hide Syllabus" : "Show Syllabus"}
                 </button>
            </div>
            {showSyllabus && <SyllabusView currentChapter={context.chapterIndex} currentEpisode={context.episodeIndex} />}
            <div className="flex gap-2 mt-4">
                <button 
                    onClick={() => onNavigate('prev')}
                    disabled={!context.navHints.hasPrevEpisode}
                    className="flex-1 bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                    &larr; Prev
                </button>
                <button 
                    onClick={() => onNavigate('next')}
                    disabled={!context.navHints.hasNextEpisode}
                    className="flex-1 bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                    Next &rarr;
                </button>
            </div>
       </PanelCard>

       <PanelCard title="Current Stage" icon={<TrophyIcon/>}>
           <div className="bg-magenta-500 text-gray-900 font-bold uppercase tracking-wider p-2 rounded-md text-center">
              {rubric?.stage || context.stage || '...'}
           </div>
       </PanelCard>
       
       <PanelCard title="Next Step" icon={<ForwardIcon />}>
        <div className="bg-gray-900 p-3 rounded-md">
            <p className="font-bold text-green-500">{nextStep?.label || '...'}</p>
            <p className="text-sm text-gray-400 mt-1">{nextStep?.reason || '...'}</p>
        </div>
      </PanelCard>

      <PanelCard title="Success Criteria" icon={<TargetIcon />}>
        <ul className="space-y-2 text-sm">
          {rubric?.successCriteria?.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="text-green-500 mt-1 mr-2 flex-shrink-0"/>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </PanelCard>

      {rubric?.commonMistakes?.length > 0 && (
          <PanelCard title="Common Mistakes" icon={<LightbulbIcon />}>
                <ul className="space-y-2 text-sm">
                {rubric.commonMistakes.map((item, index) => (
                    <li key={index} className="flex items-start">
                    <ErrorIcon className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                    <span><strong>{item.pattern}:</strong> {item.fix}</span>
                    </li>
                ))}
                </ul>
          </PanelCard>
      )}

      <PanelCard title="AI Sanity Checklist" icon={<CheckIcon/>}>
        <ul className="space-y-1 text-xs text-gray-500">
          {checklist?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
};

export default SidePanel;
