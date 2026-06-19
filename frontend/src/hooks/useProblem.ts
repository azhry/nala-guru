import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchProblem, submitAnswer, Problem, AnswerResult } from '../api';

export type PlayState = 'loading' | 'playing' | 'feedback' | 'error';

export function useProblem() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [state, setState] = useState<PlayState>('loading');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const levelRef = useRef<string>('L1');
  const lastPromptRef = useRef<string>('');

  const loadProblem = useCallback(async () => {
    setState('loading');
    setSelectedIndex(null);
    setResult(null);
    setError('');
    try {
      const p = await fetchProblem(levelRef.current);
      if (p.prompt === lastPromptRef.current) {
        const retry = await fetchProblem(levelRef.current);
        setProblem(retry);
        lastPromptRef.current = retry.prompt;
      } else {
        setProblem(p);
        lastPromptRef.current = p.prompt;
      }
      setState('playing');
    } catch (err) {
      setError('Failed to load problem');
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const pickAnswer = useCallback(async (index: number) => {
    if (!problem || state !== 'playing') return;
    setSelectedIndex(index);
    setState('feedback');
    try {
      const res = await submitAnswer(problem.problem_id, index);
      setResult(res);
    } catch {
      setResult({ correct: false, guide_text: 'Something went wrong', guide_visuals: [] });
    }
  }, [problem, state]);

  const nextProblem = useCallback(() => {
    loadProblem();
  }, [loadProblem]);

  return {
    problem,
    state,
    result,
    selectedIndex,
    error,
    pickAnswer,
    nextProblem,
    currentLevel: levelRef.current,
  };
}
