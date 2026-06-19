import { describe, it, expect, vi } from 'vitest';

vi.mock('../models/Session', () => ({
  Session: {
    find: vi.fn().mockReturnValue({
      sort: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lean: vi.fn().mockResolvedValue([
        { problemId: 'p1', correct: true, level: 'L1', timestamp: new Date('2026-06-19') },
        { problemId: 'p2', correct: true, level: 'L1', timestamp: new Date('2026-06-19') },
        { problemId: 'p3', correct: true, level: 'L1', timestamp: new Date('2026-06-19') },
        { problemId: 'p4', correct: false, level: 'L2', timestamp: new Date('2026-06-19') },
      ]),
    }),
  },
}));

import { getPerformance, PerformanceData } from '../services/performance';

describe('Performance Service - BE-003', () => {
  it('returns current level from recent session', async () => {
    const data = await getPerformance();
    expect(data.currentLevel).toBe('L1');
  });

  it('returns accuracy grouped by level', async () => {
    const data = await getPerformance();
    expect(data.accuracyByLevel.length).toBeGreaterThan(0);
    const l1 = data.accuracyByLevel.find((a) => a.level === 'L1');
    expect(l1).toBeDefined();
    expect(l1!.accuracy).toBe(100);
  });

  it('returns session list with correct structure', async () => {
    const data = await getPerformance();
    expect(data.sessions.length).toBeGreaterThan(0);
    expect(data.sessions[0]).toHaveProperty('problemId');
    expect(data.sessions[0]).toHaveProperty('correct');
    expect(data.sessions[0]).toHaveProperty('level');
  });

  it('returns streak count', async () => {
    const data = await getPerformance();
    expect(data.streak).toBe(3);
  });

  it('produces data matching CONTRACT-003 fields', async () => {
    const data = await getPerformance();

    expect(data).toHaveProperty('currentLevel');
    expect(data).toHaveProperty('accuracyByLevel');
    expect(data).toHaveProperty('sessions');

    expect(typeof data.currentLevel).toBe('string');
    expect(Array.isArray(data.accuracyByLevel)).toBe(true);
    expect(Array.isArray(data.sessions)).toBe(true);

    if (data.accuracyByLevel.length > 0) {
      expect(data.accuracyByLevel[0]).toHaveProperty('level');
      expect(data.accuracyByLevel[0]).toHaveProperty('total');
      expect(data.accuracyByLevel[0]).toHaveProperty('correct');
      expect(data.accuracyByLevel[0]).toHaveProperty('accuracy');
    }
  });
});
