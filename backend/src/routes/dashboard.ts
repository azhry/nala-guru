import { Router, Request, Response, NextFunction } from 'express';
import { getPerformance } from '../services/performance';

export const dashboardRouter = Router();

const DASHBOARD_PIN = process.env.DASHBOARD_PIN || '0000';

function pinGate(req: Request, res: Response, next: NextFunction): void {
  const pin = req.headers['x-dashboard-pin'] as string;
  if (!pin || pin !== DASHBOARD_PIN) {
    res.status(401).json({ error: 'Invalid or missing PIN' });
    return;
  }
  next();
}

dashboardRouter.get('/performance', async (_req: Request, res: Response) => {
  try {
    const data = await getPerformance();
    return res.json(data);
  } catch (err) {
    console.error('Performance fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

dashboardRouter.get('/parent/dashboard', pinGate, async (_req: Request, res: Response) => {
  try {
    const data = await getPerformance();
    return res.json({
      ...data,
      pinProtected: true,
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});
