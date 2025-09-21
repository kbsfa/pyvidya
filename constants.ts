import type { AppContext, PyvidhyaResponse } from './types';
import { getCurriculumSlice, curriculum } from './curriculum';

const initialCurriculum = getCurriculumSlice(0, 0);

export const initialContext: AppContext = {
  chapterIndex: 0,
  episodeIndex: 0,
  stage: 'discover',
  chapterTitle: curriculum[0]?.title || "Unknown Chapter",
  episodeTitle: curriculum[0]?.episodes[0]?.title || "Unknown Episode",
  objectives: ["Understand variables as data containers", "Master variable assignment with = operator", "Learn print() function for output"],
  editorCode: initialCurriculum.stageContent?.discover?.codeSample || "# Let's start coding!",
  editorDirtySinceMs: 0,
  lastRun: {
    timestamp: null,
    stdout: "",
    stderr: "",
    success: true,
    durationMs: 0,
  },
  recentErrors: [],
  attempts: 0,
  timeOnEpisodeSec: 0,
  hintsUsed: 0,
  chatTurns: 0,
  historyShort: "The user has just started the first lesson.",
  progress: {
    coins: 0,
    streakDays: 0,
    achievements: [],
    completed: {},
  },
  userSignals: {
    inactiveForSec: 0,
    frustration: false,
    engagement: 'high',
  },
  ui: {
    chatCollapsed: false,
    ttsEnabled: true,
    sttEnabled: false,
    femaleVoicePreferred: true,
    language: 'en-US', // Default language
  },
  curriculumSlice: {
    stageContent: initialCurriculum.stageContent ?? {},
    practiceBlanks: initialCurriculum.practiceBlanks ?? [],
    tests: initialCurriculum.tests ?? [],
  },
  navHints: {
    hasPrevStage: false,
    hasNextStage: true,
    hasPrevEpisode: false,
    hasNextEpisode: true,
  },
};

export const initialResponse: PyvidhyaResponse = {
  readingContent: "🚀 <strong>Hey there! I'm Pyvidhya, your personal Python guide!</strong><br><br>I'm so excited to start this journey with you. We're going to learn a ton and have fun doing it.<br><br>Our first lesson is all about <strong>variables</strong>. Think of them as little labeled boxes where you can store information.<br><br>Let's get started! Try typing some code in the editor to your right and click 'Run'.",
  speakingContent: "Hey there! I'm Pyvidhya, your personal Python guide! I'm so excited to start this journey with you. Let's get started!",
  actions: [],
  checklist: [
    "✓ Restated current objectives in own words",
    "✓ Acknowledged current stage (discover/explore/practice/apply/master)",
    "✓ Maintained young female teacher persona consistently",
    "✓ Provided specific actionable next step",
    "✓ Referenced current lesson content appropriately",
  ],
  rubric: {
    stage: 'discover',
    successCriteria: [
      "Type `name = 'Your Name'` in the editor",
      "Type `print(name)` on the next line",
      "Run the code and see your name in the output!"
    ],
    commonMistakes: [],
  },
  nextStep: {
    label: "Write your first line of code.",
    reason: "This is the first step to understanding how to store and display information in Python."
  }
};