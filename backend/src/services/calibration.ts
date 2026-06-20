import { t } from './ai/locales';

export const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];

export const LEVEL_NAMES: Record<string, string> = {
  L1: 'Crawler',
  L2: 'Toddler',
  L3: 'Walker',
  L4: 'Runner',
  L5: 'Climber',
};

const STREAK_THRESHOLD = 3;
const STREAK_DROP = 2;

interface Session {
  correct: boolean;
  level: string;
  timestamp: Date;
}

export class Calibrator {
  private sessions: Session[] = [];

  constructor(sessions?: Session[]) {
    if (sessions) this.sessions = sessions;
  }

  addSession(correct: boolean, level: string): void {
    this.sessions.push({ correct, level, timestamp: new Date() });
  }

  getCurrentLevel(): string {
    if (this.sessions.length === 0) return LEVELS[0];

    const recent = this.sessions.slice(-10);
    const levelIndex = LEVELS.indexOf(recent[recent.length - 1].level);
    if (levelIndex === -1) return LEVELS[0];

    const correctCount = recent.filter((s) => s.correct).length;
    const accuracy = correctCount / recent.length;

    if (accuracy >= 0.8 && levelIndex < LEVELS.length - 1) {
      return LEVELS[levelIndex + 1];
    }
    if (accuracy <= 0.3 && levelIndex > 0) {
      return LEVELS[levelIndex - 1];
    }
    return LEVELS[levelIndex];
  }

  getStreak(): number {
    let streak = 0;
    for (let i = this.sessions.length - 1; i >= 0; i--) {
      if (this.sessions[i].correct) streak++;
      else break;
    }
    return streak;
  }

  getProgressPct(): number {
    if (this.sessions.length === 0) return 0;

    const recent = this.sessions.slice(-10);
    const levelIndex = LEVELS.indexOf(recent[recent.length - 1].level);
    if (levelIndex === -1) return 0;

    if (levelIndex >= LEVELS.length - 1) return 100;

    const correctCount = recent.filter((s) => s.correct).length;
    const accuracy = correctCount / recent.length;

    if (accuracy <= 0.3) return 0;
    if (accuracy >= 0.8) return 100;
    return Math.round(((accuracy - 0.3) / (0.8 - 0.3)) * 100);
  }

  getLevelChangeInfo(newLevel: string): { levelChanged: boolean; oldLevel: string; newLevel: string; progressPct: number } {
    const oldLevel = this.sessions.length > 0
      ? this.sessions[this.sessions.length - 1].level
      : LEVELS[0];
    return {
      levelChanged: oldLevel !== newLevel,
      oldLevel,
      newLevel,
      progressPct: this.getProgressPct(),
    };
  }

  shouldAdvanceLevel(): boolean {
    return this.getStreak() >= STREAK_THRESHOLD;
  }

  shouldDropLevel(): boolean {
    if (this.sessions.length < STREAK_DROP) return false;
    const lastN = this.sessions.slice(-STREAK_DROP);
    return lastN.every((s) => !s.correct);
  }

  getGuide(correct: boolean, level: string, locale = 'en'): { text: string; visuals: string[] } {
    const strings = t(locale);
    const displayName = LEVEL_NAMES[level] || level;

    if (correct) {
      return {
        text: strings.calibrator.correct(displayName),
        visuals: ['star-burst', 'check-mark'],
      };
    }

    const guideTexts: Record<string, string> = {
      L1: strings.calibrator.L1,
      L2: strings.calibrator.L2,
      L3: strings.calibrator.L3,
      L4: strings.calibrator.L4,
      L5: strings.calibrator.L5,
    };

    const visuals: Record<string, string[]> = {
      L1: ['counting-fingers', 'dots-visual'],
      L2: ['finger-counting', 'number-line'],
      L3: ['place-value', 'number-blocks'],
      L4: ['count-back', 'number-line'],
      L5: ['shape-guide', 'edge-count'],
    };

    return {
      text: guideTexts[level] || strings.calibrator.fallback,
      visuals: visuals[level] || ['think-bubble'],
    };
  }
}

export function createCalibrator(sessions?: Session[]): Calibrator {
  return new Calibrator(sessions);
}
