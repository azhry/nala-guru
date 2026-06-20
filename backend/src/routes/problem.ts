import crypto from 'crypto';
import { Router, Request, Response } from 'express';
import { Problem } from '../models/Problem';
import { Session } from '../models/Session';
import { generateProblem } from '../services/ai';
import { detectLocale } from '../services/ai/locales';

export const problemRouter = Router();

const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];

function getLevel(sessionCount: number): string {
  const idx = Math.min(Math.floor(sessionCount / 10), LEVELS.length - 1);
  return LEVELS[idx];
}

problemRouter.get('/problem', async (req: Request, res: Response) => {
  try {
    const level = (req.query.level as string) || getLevel(0);
    const locale = detectLocale(req);

    if (locale === 'en') {
      const answeredProblemIds = await Session.distinct('problemId', { level });

      const filter: Record<string, unknown> = { level };
      if (answeredProblemIds.length > 0) {
        filter.problemId = { $nin: answeredProblemIds };
      }

      const cached = await Problem.findOne(filter).sort({ createdAt: -1 });
      if (cached) {
        return res.json({
          problem_id: cached.problemId,
          prompt: cached.prompt,
          choices: cached.choices,
          correct_index: cached.correctIndex,
          level: cached.level,
        });
      }
    }

    const problemData = await generateProblem(level, locale);

    const doc = await Problem.create({
      problemId: problemData.problemId,
      prompt: problemData.prompt,
      choices: problemData.choices,
      correctIndex: problemData.correctIndex,
      level: problemData.level,
    });

    return res.json({
      problem_id: doc.problemId,
      prompt: doc.prompt,
      choices: doc.choices,
      correct_index: doc.correctIndex,
      level: doc.level,
    });
  } catch (err) {
    console.error('Problem generation error:', err);
    return res.status(500).json({
      error: 'Failed to generate problem',
      detail: process.env.NODE_ENV === 'development' ? (err as Error).message : undefined,
    });
  }
});
