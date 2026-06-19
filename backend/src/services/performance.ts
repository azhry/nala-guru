import { Session } from '../models/Session';

const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];

export interface LevelAccuracy {
  level: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface SessionSummary {
  problemId: string;
  correct: boolean;
  level: string;
  timestamp: Date;
}

export interface PerformanceData {
  currentLevel: string;
  accuracyByLevel: LevelAccuracy[];
  sessions: SessionSummary[];
  streak: number;
  totalSessions: number;
}

export async function getPerformance(): Promise<PerformanceData> {
  const allSessions = await Session.find().sort({ timestamp: -1 }).limit(100).lean();

  const sessions: SessionSummary[] = allSessions.map((s) => ({
    problemId: s.problemId,
    correct: s.correct,
    level: s.level,
    timestamp: s.timestamp,
  }));

  const accuracyByLevel: LevelAccuracy[] = LEVELS.map((level) => {
    const levelSessions = allSessions.filter((s) => s.level === level);
    const total = levelSessions.length;
    const correct = levelSessions.filter((s) => s.correct).length;
    return {
      level,
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });

  const recent = allSessions[0];
  const currentLevel = recent ? recent.level : LEVELS[0];

  let streak = 0;
  for (const s of allSessions) {
    if (s.correct) streak++;
    else break;
  }

  return {
    currentLevel,
    accuracyByLevel: accuracyByLevel,
    sessions: sessions.slice(0, 20),
    streak,
    totalSessions: allSessions.length,
  };
}
