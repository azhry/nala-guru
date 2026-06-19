import { Router, Request, Response } from 'express';
import { Account } from '../models/Account';

export const accountRouter = Router();

accountRouter.get('/account', async (_req: Request, res: Response) => {
  try {
    const account = await Account.findOne().sort({ createdAt: -1 });
    if (!account) {
      return res.json({ exists: false });
    }
    res.json({ exists: true, babyName: account.babyName, babyBirthDate: account.babyBirthDate });
  } catch {
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

accountRouter.post('/account', async (req: Request, res: Response) => {
  try {
    const { babyName, babyBirthDate } = req.body;
    if (!babyName || !babyBirthDate) {
      return res.status(400).json({ error: 'babyName and babyBirthDate are required' });
    }
    const account = await Account.create({ babyName, babyBirthDate });
    res.status(201).json({ exists: true, babyName: account.babyName, babyBirthDate: account.babyBirthDate });
  } catch {
    res.status(500).json({ error: 'Failed to create account' });
  }
});
