
export interface PyvidhyaResponse {
  readingContent: string;
  speakingContent: string;
  actions: PyvidhyaAction[];
  checklist: string[];
  rubric: Rubric;
  nextStep: NextStep;
}

export interface PyvidhyaAction {
  type: string; // e.g., "awardCoins", "offerHint", "nudgeRunCode"
  payload: Record<string, any>;
}

export interface Rubric {
  stage: 'discover' | 'explore' | 'practice' | 'apply' | 'master';
  successCriteria: string[];
  commonMistakes: CommonMistake[];
}

export interface CommonMistake {
  pattern: string;
  fix: string;
}

export interface NextStep {
  label: string;
  reason: string;
}

export interface AppContext {
  chapterIndex: number;
  episodeIndex: number;
  stage: 'discover' | 'explore' | 'practice' | 'apply' | 'master';
  chapterTitle: string;
  episodeTitle: string;
  objectives: string[];
  editorCode: string;
  editorDirtySinceMs: number;
  lastRun: LastRun;
  recentErrors: RecentError[];
  attempts: number;
  timeOnEpisodeSec: number;
  hintsUsed: number;
  chatTurns: number;
  historyShort: string;
  progress: Progress;
  userSignals: UserSignals;
  ui: UIState;
  curriculumSlice: CurriculumSlice;
  navHints: NavHints;
}

export interface LastRun {
  timestamp: number | null;
  stdout: string;
  stderr: string;
  success: boolean;
  durationMs: number;
}

export interface RecentError {
  message: string;
  line: number;
  col: number;
  attemptIndex: number;
}

export interface Progress {
  coins: number;
  streakDays: number;
  achievements: string[];
  completed: Record<string, Record<string, string[]>>;
}

export interface UserSignals {
  inactiveForSec: number;
  frustration: boolean;
  engagement: 'low' | 'medium' | 'high';
}

export interface UIState {
  chatCollapsed: boolean;
  ttsEnabled: boolean;
  sttEnabled: boolean;
  femaleVoicePreferred: boolean;
}

export interface CurriculumSlice {
  stageContent: any;
  practiceBlanks: string[];
  tests: Test[];
}

export interface Test {
    name: string;
    expect: string[];
}

export interface NavHints {
    hasPrevStage: boolean;
    hasNextStage: boolean;
    hasPrevEpisode: boolean;
    hasNextEpisode: boolean;
}
