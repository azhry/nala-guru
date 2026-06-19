const API_BASE = '/api';

export interface Problem {
  problem_id: string;
  prompt: string;
  choices: string[];
  correct_index: number;
  level: string;
}

export interface AnswerResult {
  correct: boolean;
  guide_text: string;
  guide_visuals: string[];
}

export async function fetchProblem(level?: string): Promise<Problem> {
  const params = level ? `?level=${level}` : '';
  const res = await fetch(`${API_BASE}/problem${params}`);
  if (!res.ok) throw new Error('Failed to fetch problem');
  return res.json();
}

export async function submitAnswer(problemId: string, answerIndex: number): Promise<AnswerResult> {
  const res = await fetch(`${API_BASE}/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem_id: problemId, answer_index: answerIndex }),
  });
  if (!res.ok) throw new Error('Failed to submit answer');
  return res.json();
}
