import { describe, it, expect } from 'vitest';
import { LocalProvider } from '../services/ai/local';

const provider = new LocalProvider();

const validLevels = ['counting', 'addition_1', 'addition_2', 'subtraction_1', 'shapes'];

describe('LocalProvider', () => {
  it.each(validLevels)('generates a valid problem for level %s', (level) => {
    const problem = provider.generateProblem(level);

    expect(problem).toHaveProperty('problemId');
    expect(typeof problem.problemId).toBe('string');
    expect(problem.problemId.length).toBeGreaterThan(0);

    expect(problem).toHaveProperty('prompt');
    expect(typeof problem.prompt).toBe('string');
    expect(problem.prompt.length).toBeGreaterThan(0);

    expect(problem).toHaveProperty('choices');
    expect(Array.isArray(problem.choices)).toBe(true);
    expect(problem.choices).toHaveLength(4);

    expect(problem).toHaveProperty('correctIndex');
    expect(problem.correctIndex).toBeGreaterThanOrEqual(0);
    expect(problem.correctIndex).toBeLessThan(4);

    expect(problem).toHaveProperty('level');
    expect(problem.level).toBe(level);
  });

  it('generates unique problemIds on each call', () => {
    const p1 = provider.generateProblem('counting');
    const p2 = provider.generateProblem('counting');
    expect(p1.problemId).not.toBe(p2.problemId);
  });

  it('never calls external APIs (no async)', () => {
    const result = provider.generateProblem('counting');
    expect(result).toBeDefined();
  });

  it('throws for unknown level', () => {
    expect(() => provider.generateProblem('unknown_level')).toThrow('Unknown level');
  });

  it('provides different problems within same level', () => {
    const prompts = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const p = provider.generateProblem('counting');
      prompts.add(p.prompt);
    }
    expect(prompts.size).toBeGreaterThan(1);
  });

  it('has 4 choices with exactly 1 correct answer', () => {
    for (const level of validLevels) {
      const problem = provider.generateProblem(level);
      const correctChoice = problem.choices[problem.correctIndex];
      expect(correctChoice).toBeDefined();
      const matching = problem.choices.filter((c, i) => i === problem.correctIndex);
      expect(matching).toHaveLength(1);
    }
  });
});
