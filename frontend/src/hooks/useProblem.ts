import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchProblem, submitAnswer, Problem, AnswerResult } from '../api';

export type PlayState = 'loading' | 'playing' | 'feedback' | 'error';

export function useProblem(locale = 'en') {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [state, setState] = useState<PlayState>('loading');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [levelChanged, setLevelChanged] = useState(false);
  const [newLevel, setNewLevel] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(0);
  const levelRef = useRef<string>('L1');
  const lastPromptRef = useRef<string>('');

  const loadProblem = useCallback(async () => {
    setState('loading');
    setLevelChanged(false);
    setNewLevel(null);
    setSelectedIndex(null);
    setResult(null);
    setError('');
    try {
      const p = await fetchProblem(levelRef.current, locale);
      const promptKey = `${locale}:${p.prompt}`;
      if (promptKey === lastPromptRef.current) {
        const retry = await fetchProblem(levelRef.current, locale);
        setProblem(retry);
        lastPromptRef.current = `${locale}:${retry.prompt}`;
      } else {
        setProblem(p);
        lastPromptRef.current = promptKey;
      }
      setState('playing');
    } catch (err) {
      setError('Failed to load problem');
      setState('error');
    }
  }, [locale]);

  useEffect(() => {
    loadProblem();
  }, [loadProblem]);

  const pickAnswer = useCallback(async (index: number) => {
    if (!problem || state !== 'playing') return;
    setSelectedIndex(index);
    setState('feedback');
    try {
      const res = await submitAnswer(problem.problem_id, index, locale);
      setResult(res);
      if (res.level_changed && res.new_level) {
        setLevelChanged(true);
        setNewLevel(res.new_level);
        levelRef.current = res.new_level;
      }
      if (res.progress_pct !== undefined) {
        setProgressPct(res.progress_pct);
      }
    } catch {
      setResult({ correct: false, guide_text: 'Something went wrong', guide_visuals: [] });
    }
  }, [locale, problem, state]);

  const dismissLevelUp = useCallback(() => {
    setLevelChanged(false);
  }, []);

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
    levelChanged,
    newLevel,
    progressPct,
    dismissLevelUp,
  };
}
