import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import http from 'http';
import mongoose from 'mongoose';
import { app } from '../../index';
import { Problem } from '../../models/Problem';
import { Session } from '../../models/Session';
import { Account } from '../../models/Account';

const MONGO_URI = 'mongodb://localhost:27017/baby-math-integration-test';
const CONTAINER = 'baby-math-test-mongo';

const hasDocker = (() => {
  try { execSync('docker info', { stdio: 'pipe' }); return true; }
  catch { return false; }
})();

if (!hasDocker) {
  describe.skip('Integration tests (Docker unavailable)', () => {});
} else {
  let server: http.Server;
  let baseUrl: string;

  function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function request(path: string, opts?: { method?: string; body?: unknown; headers?: Record<string, string> }) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: opts?.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...opts?.headers },
      body: opts?.body ? JSON.stringify(opts.body) : undefined,
    });
    const text = await res.text();
    let body: unknown;
    try { body = JSON.parse(text); } catch { body = text; }
    return { status: res.status, body };
  }

  function dockerRun(...args: string[]) {
    return execSync(`docker ${args.join(' ')}`, { stdio: 'pipe', encoding: 'utf-8', timeout: 120000 }).toString().trim();
  }

  function dockerIgnore(...args: string[]) {
    try { return dockerRun(...args); } catch { return ''; }
  }

  beforeAll(async () => {
    dockerIgnore('kill', CONTAINER);
    dockerIgnore('rm', CONTAINER);

    dockerRun('run', '-d', '--name', CONTAINER, '-p', '27017:27017', 'mongo:7');

    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        await mongoose.disconnect();
        ready = true;
        break;
      } catch {
        await sleep(2000);
      }
    }
    if (!ready) throw new Error('MongoDB did not start within 60s');

    await mongoose.connect(MONGO_URI);

    await Problem.create({
      problemId: 'test-problem-001',
      prompt: 'What is 2 + 3?',
      choices: ['4', '5', '6', '7'],
      correctIndex: 1,
      level: 'L1',
    });

    await new Promise<void>(resolve => {
      server = app.listen(0, () => {
        const addr = server.address();
        if (addr && typeof addr === 'object') {
          baseUrl = `http://localhost:${addr.port}`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    server?.close();
    await mongoose.disconnect();
    dockerIgnore('kill', CONTAINER);
    dockerIgnore('rm', CONTAINER);
  });

  beforeEach(async () => {
    await Session.deleteMany({});
    await Account.deleteMany({});
  });

  describe('Health', () => {
    it('GET /health returns service status', async () => {
      const { status, body } = await request('/health');
      expect(status).toBe(200);
      expect(body).toEqual({ status: 'ok', service: 'baby-math-backend' });
    });
  });

  describe('Problem API', () => {
    it('GET /api/problem returns a valid problem', async () => {
      const { status, body } = await request('/api/problem?level=L1&lang=en');
      expect(status).toBe(200);
      expect(body).toHaveProperty('problem_id');
      expect(typeof body.problem_id).toBe('string');
      expect(body).toHaveProperty('prompt');
      expect(body).toHaveProperty('choices');
      expect(body.choices).toHaveLength(4);
      expect(body).toHaveProperty('correct_index');
      expect(typeof body.correct_index).toBe('number');
      expect(body).toHaveProperty('level');
    });

    it('GET /api/problem returns cached problem when available', async () => {
      const { body: first } = await request('/api/problem?level=L1&lang=en');
      const { body: second } = await request('/api/problem?level=L1&lang=en');
      expect(second.problem_id).toBe(first.problem_id);
    });

    it('GET /api/problem returns different problem after answering', async () => {
      const { body: problem } = await request('/api/problem?level=L1&lang=en');
      await request('/api/answer', {
        method: 'POST',
        body: { problem_id: problem.problem_id, answer_index: problem.correct_index },
      });
      const { body: next } = await request('/api/problem?level=L1&lang=en');
      expect(next.problem_id).not.toBe(problem.problem_id);
    });

    it('GET /api/problem?lang=id returns Indonesian prompt', async () => {
      const { status, body } = await request('/api/problem?level=L1&lang=id');
      expect(status).toBe(200);
      expect(body).toHaveProperty('problem_id');
      expect(body).toHaveProperty('prompt');
    });

    it('GET /api/problem with Accept-Language header returns Indonesian', async () => {
      const { status, body } = await request('/api/problem?level=L1', {
        headers: { 'Accept-Language': 'id' },
      });
      expect(status).toBe(200);
      expect(body).toHaveProperty('problem_id');
    });

    it('GET /api/problem returns 500 for invalid level', async () => {
      const { status } = await request('/api/problem?level=L99');
      expect(status).toBe(500);
    });
  });

  describe('Answer API', () => {
    it('POST /api/answer returns correct=true for right answer', async () => {
      const { body: problem } = await request('/api/problem?level=L1');
      const { status, body } = await request('/api/answer', {
        method: 'POST',
        body: { problem_id: problem.problem_id, answer_index: problem.correct_index },
      });
      expect(status).toBe(200);
      expect(body.correct).toBe(true);
      expect(body).toHaveProperty('guide_text');
      expect(body).toHaveProperty('guide_visuals');
      expect(Array.isArray(body.guide_visuals)).toBe(true);
      expect(body).toHaveProperty('level_changed');
      expect(body).toHaveProperty('new_level');
      expect(body).toHaveProperty('progress_pct');
    });

    it('POST /api/answer returns correct=false for wrong answer', async () => {
      const { body: problem } = await request('/api/problem?level=L1');
      const wrongIndex = problem.correct_index === 0 ? 1 : 0;
      const { status, body } = await request('/api/answer', {
        method: 'POST',
        body: { problem_id: problem.problem_id, answer_index: wrongIndex },
      });
      expect(status).toBe(200);
      expect(body.correct).toBe(false);
      expect(body.guide_text).toBeTruthy();
    });

    it('POST /api/answer returns 400 for missing fields', async () => {
      const { status, body } = await request('/api/answer', {
        method: 'POST',
        body: {},
      });
      expect(status).toBe(400);
    });

    it('POST /api/answer returns 400 when answer_index is null', async () => {
      const { status, body } = await request('/api/answer', {
        method: 'POST',
        body: { problem_id: 'test', answer_index: null },
      });
      expect(status).toBe(400);
    });

    it('POST /api/answer returns 404 for nonexistent problem', async () => {
      const { status, body } = await request('/api/answer', {
        method: 'POST',
        body: { problem_id: 'nonexistent-id', answer_index: 0 },
      });
      expect(status).toBe(404);
    });
  });

  describe('Performance API', () => {
    it('GET /api/performance returns empty performance when no sessions', async () => {
      const { status, body } = await request('/api/performance');
      expect(status).toBe(200);
      expect(body.totalSessions).toBe(0);
      expect(body.streak).toBe(0);
      expect(body.sessions).toEqual([]);
      expect(body.accuracyByLevel).toHaveLength(5);
      for (const entry of body.accuracyByLevel) {
        expect(entry.total).toBe(0);
        expect(entry.correct).toBe(0);
        expect(entry.accuracy).toBe(0);
      }
    });

    it('GET /api/performance returns data after answering problems', async () => {
      const { body: problem } = await request('/api/problem?level=L1&lang=en');
      await request('/api/answer', {
        method: 'POST',
        body: { problem_id: problem.problem_id, answer_index: problem.correct_index },
      });
      const { status, body } = await request('/api/performance');
      expect(status).toBe(200);
      expect(body.totalSessions).toBe(1);
      expect(body.sessions).toHaveLength(1);
      expect(body.sessions[0].correct).toBe(true);
      expect(body.accuracyByLevel).toHaveLength(5);
      const l1 = body.accuracyByLevel.find((a: { level: string }) => a.level === 'L1');
      expect(l1).toBeDefined();
      expect(l1.total).toBe(1);
      expect(l1.correct).toBe(1);
    });

    it('GET /api/performance tracks streak with consecutive correct answers', async () => {
      for (let i = 0; i < 3; i++) {
        const { body: problem } = await request('/api/problem?level=L1&lang=en');
        await request('/api/answer', {
          method: 'POST',
          body: { problem_id: problem.problem_id, answer_index: problem.correct_index },
        });
      }
      const { body } = await request('/api/performance');
      expect(body.totalSessions).toBe(3);
      expect(body.streak).toBe(3);
    });
  });

  describe('Account API', () => {
    it('GET /api/account returns exists=false when no account', async () => {
      const { status, body } = await request('/api/account');
      expect(status).toBe(200);
      expect(body.exists).toBe(false);
    });

    it('POST /api/account creates account', async () => {
      const { status, body } = await request('/api/account', {
        method: 'POST',
        body: { babyName: 'Test Baby', babyBirthDate: '2024-01-15' },
      });
      expect(status).toBe(201);
    });

    it('GET /api/account returns account after creation', async () => {
      await request('/api/account', {
        method: 'POST',
        body: { babyName: 'Test Baby', babyBirthDate: '2024-01-15' },
      });
      const { status, body } = await request('/api/account');
      expect(status).toBe(200);
      expect(body.exists).toBe(true);
      expect(body.babyName).toBe('Test Baby');
      expect(body.babyBirthDate).toBe('2024-01-15');
    });

    it('POST /api/account returns 400 when babyName missing', async () => {
      const { status, body } = await request('/api/account', {
        method: 'POST',
        body: { babyBirthDate: '2024-01-15' },
      });
      expect(status).toBe(400);
    });

    it('POST /api/account returns 400 when babyBirthDate missing', async () => {
      const { status, body } = await request('/api/account', {
        method: 'POST',
        body: { babyName: 'Test Baby' },
      });
      expect(status).toBe(400);
    });
  });

  describe('Parent Dashboard (PIN Gate)', () => {
    it('GET /api/parent/dashboard returns 401 without PIN', async () => {
      const { status, body } = await request('/api/parent/dashboard');
      expect(status).toBe(401);
    });

    it('GET /api/parent/dashboard returns 401 with wrong PIN', async () => {
      const { status, body } = await request('/api/parent/dashboard', {
        headers: { 'x-dashboard-pin': '9999' },
      });
      expect(status).toBe(401);
    });

    it('GET /api/parent/dashboard returns data with correct PIN', async () => {
      const { status, body } = await request('/api/parent/dashboard', {
        headers: { 'x-dashboard-pin': '0000' },
      });
      expect(status).toBe(200);
      expect(body).toHaveProperty('pinProtected');
      expect(body.pinProtected).toBe(true);
    });
  });
}
