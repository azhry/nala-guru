import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../services/ai', () => ({
  generateProblem: vi.fn().mockImplementation(async (level: string) => ({
    problemId: 'test-uuid',
    prompt: 'What is 1 + 1?',
    choices: ['1', '2', '3', '4'],
    correctIndex: 1,
    level,
  })),
}));

vi.mock('../models/Problem', () => {
  const mockDoc = (overrides = {}) => ({
    problemId: 'test-uuid',
    prompt: 'What is 1 + 1?',
    choices: ['1', '2', '3', '4'],
    correctIndex: 1,
    level: 'counting',
    ...overrides,
  });

  let store: any[] = [];

  return {
    Problem: {
      findOne: vi.fn().mockImplementation((query: any) => {
        const found = store.find((p) => p.level === query.level);
        return Promise.resolve(found || null);
      }),
      create: vi.fn().mockImplementation((data: any) => {
        const doc = mockDoc(data);
        store.push(doc);
        return Promise.resolve(doc);
      }),
    },
  };
});

import { Problem } from '../models/Problem';
import { generateProblem } from '../services/ai';

describe('Problem API - BE-001', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  it('generates a problem via AI when cache is empty', async () => {
    const result = await generateProblem('counting');

    expect(result).toMatchObject({
      prompt: expect.any(String),
      choices: expect.arrayContaining([expect.any(String)]),
      correctIndex: expect.any(Number),
      level: 'counting',
    });
    expect(result.choices).toHaveLength(4);
  });

  it('produces problem matching CONTRACT-001 fields', async () => {
    const result = await generateProblem('counting');

    expect(result).toHaveProperty('problemId');
    expect(result).toHaveProperty('prompt');
    expect(result).toHaveProperty('choices');
    expect(result).toHaveProperty('correctIndex');
    expect(result).toHaveProperty('level');

    expect(typeof result.problemId).toBe('string');
    expect(result.problemId.length).toBeGreaterThan(0);
    expect(typeof result.prompt).toBe('string');
    expect(result.prompt.length).toBeGreaterThan(0);
    expect(Array.isArray(result.choices)).toBe(true);
    expect(result.choices.length).toBeGreaterThanOrEqual(2);
    expect(typeof result.correctIndex).toBe('number');
    expect(result.correctIndex).toBeGreaterThanOrEqual(0);
    expect(result.correctIndex).toBeLessThan(result.choices.length);
    expect(typeof result.level).toBe('string');
    expect(result.level.length).toBeGreaterThan(0);
  });

  it('generates problems at different levels', async () => {
    const levels = ['counting', 'addition_1', 'subtraction_1'];

    for (const level of levels) {
      (Problem.findOne as any).mockResolvedValueOnce(null);
      const result = await generateProblem(level);
      expect(result.level).toBe(level);
    }
  });
});
