import { Router, Request, Response } from 'express';
import { Problem } from '../models/Problem';
import { Session } from '../models/Session';
import { Calibrator } from '../services/calibration';

export const answerRouter = Router();

answerRouter.post('/answer', async (req: Request, res: Response) => {
  try {
    const { problem_id, answer_index } = req.body;

    if (!problem_id || answer_index === undefined || answer_index === null) {
      return res.status(400).json({ error: 'problem_id and answer_index required' });
    }

    const problem = await Problem.findOne({ problemId: problem_id });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const correct = answer_index === problem.correctIndex;

    await Session.create({
      problemId: problem_id,
      correct,
      level: problem.level,
      answerIndex: answer_index,
      correctIndex: problem.correctIndex,
    });

    const recentSessions = await Session.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();

    const calibrator = new Calibrator(
      recentSessions.reverse().map((s) => ({
        correct: s.correct,
        level: s.level,
        timestamp: s.timestamp,
      }))
    );

    const newLevel = calibrator.getCurrentLevel();
    const levelChange = calibrator.getLevelChangeInfo(newLevel);
    const guide = calibrator.getGuide(correct, problem.level);

    return res.json({
      correct,
      guide_text: guide.text,
      guide_visuals: guide.visuals,
      level_changed: levelChange.levelChanged,
      new_level: levelChange.newLevel,
      progress_pct: levelChange.progressPct,
    });
  } catch (err) {
    console.error('Answer submission error:', err);
    return res.status(500).json({
      error: 'Failed to process answer',
    });
  }
});
