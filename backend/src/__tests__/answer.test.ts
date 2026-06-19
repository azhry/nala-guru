import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../models/Session', () => {
  let store: any[] = [];
  return {
    Session: {
      create: vi.fn().mockImplementation((data: any) => {
        const doc = { ...data, _id: 'mock-id', timestamp: new Date() };
        store.push(doc);
        return Promise.resolve(doc);
      }),
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      }),
    },
  };
});

vi.mock('../models/Problem', () => ({
  Problem: {
    findOne: vi.fn().mockResolvedValue({
      problemId: 'test-problem',
      prompt: 'What is 2 + 2?',
      choices: ['3', '4', '5', '6'],
      correctIndex: 1,
      level: 'L1',
    }),
  },
}));

import { answerRouter } from '../routes/answer';
import { Session } from '../models/Session';

describe('Answer API - BE-002', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('validates problem_id and answer_index are required', async () => {
    const mockReq = { method: 'POST', body: {} } as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await answerRouter.stack[0].handle(mockReq, mockRes, () => {});
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});

describe('Calibrator - BE-002', () => {
  it('getGuide returns correct structure', async () => {
    const { Calibrator } = await import('../services/calibration');
    const c = new Calibrator();
    const guide = c.getGuide(true, 'L1');

    expect(guide).toHaveProperty('text');
    expect(guide).toHaveProperty('visuals');
    expect(typeof guide.text).toBe('string');
    expect(Array.isArray(guide.visuals)).toBe(true);
  });

  it('getCurrentLevel returns valid level string', async () => {
    const { Calibrator } = await import('../services/calibration');
    const c = new Calibrator();
    const level = c.getCurrentLevel();
    const validLevels = ['L1', 'L2', 'L3', 'L4', 'L5'];
    expect(validLevels).toContain(level);
  });
});
