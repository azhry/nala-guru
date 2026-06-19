const LEVELS = ['counting', 'addition_1', 'addition_2', 'subtraction_1', 'shapes'];

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

  shouldAdvanceLevel(): boolean {
    return this.getStreak() >= STREAK_THRESHOLD;
  }

  shouldDropLevel(): boolean {
    if (this.sessions.length < STREAK_DROP) return false;
    const lastN = this.sessions.slice(-STREAK_DROP);
    return lastN.every((s) => !s.correct);
  }

  getGuide(correct: boolean, level: string): { text: string; visuals: string[] } {
    if (correct) {
      return {
        text: `Great job! You solved it correctly at ${level} level!`,
        visuals: ['star-burst', 'check-mark'],
      };
    }

    const guides: Record<string, { text: string; visuals: string[] }> = {
      counting: {
        text: 'Count each item slowly. Point to each one as you count.',
        visuals: ['counting-fingers', 'dots-visual'],
      },
      addition_1: {
        text: 'Try using your fingers to add the numbers together.',
        visuals: ['finger-counting', 'number-line'],
      },
      addition_2: {
        text: 'Break the bigger number into tens and ones.',
        visuals: ['place-value', 'number-blocks'],
      },
      subtraction_1: {
        text: 'Start with the bigger number, then count backward.',
        visuals: ['count-back', 'number-line'],
      },
      shapes: {
        text: 'Look at the shape edges and corners to count them.',
        visuals: ['shape-guide', 'edge-count'],
      },
    };

    return guides[level] || {
      text: 'Try again! Think carefully about the question.',
      visuals: ['think-bubble'],
    };
  }
}

export function createCalibrator(sessions?: Session[]): Calibrator {
  return new Calibrator(sessions);
}
