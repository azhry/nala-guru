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
  timestamp: string;
}

export interface PerformanceData {
  currentLevel: string;
  accuracyByLevel: LevelAccuracy[];
  sessions: SessionSummary[];
  streak: number;
  totalSessions: number;
}

export async function fetchPerformance(): Promise<PerformanceData> {
  const res = await fetch(`${API_BASE}/performance`);
  if (!res.ok) throw new Error('Failed to fetch performance');
  return res.json();
}

export interface Account {
  exists: boolean;
  babyName?: string;
  babyBirthDate?: string;
}

export async function createAccount(babyName: string, babyBirthDate: string): Promise<Account> {
  const res = await fetch(`${API_BASE}/account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ babyName, babyBirthDate }),
  });
  if (!res.ok) throw new Error('Failed to create account');
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
