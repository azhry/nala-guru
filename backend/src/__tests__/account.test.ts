import { describe, it, expect, vi, beforeAll } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindOne: vi.fn(),
}));

vi.mock('../models/Account', () => ({
  Account: {
    create: (...args: any[]) => mocks.mockCreate(...args),
    findOne: (...args: any[]) => mocks.mockFindOne(...args),
  },
}));

import { accountRouter } from '../routes/account';

describe('Account API', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns exists=false when no account', async () => {
    mocks.mockFindOne.mockImplementation(() => ({
      sort: () => Promise.resolve(null),
    }));

    const mockReq = { method: 'GET', url: '/account' } as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    accountRouter.stack[0].handle(mockReq, mockRes, () => {});
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.json).toHaveBeenCalledWith({ exists: false });
  });

  it('creates an account with babyName and babyBirthDate', async () => {
    mocks.mockCreate.mockImplementation(() =>
      Promise.resolve({ babyName: 'Nala', babyBirthDate: '2026-04-01' })
    );

    const mockReq = { method: 'POST', url: '/account', body: { babyName: 'Nala', babyBirthDate: '2026-04-01' } } as any;
    const statusSpy = vi.fn().mockReturnThis();
    const jsonSpy = vi.fn();
    const mockRes = {
      status: statusSpy,
      json: jsonSpy,
    } as any;

    accountRouter.stack[1].handle(mockReq, mockRes, () => {});
    await new Promise(resolve => setImmediate(resolve));

    expect(mocks.mockCreate).toHaveBeenCalledWith({ babyName: 'Nala', babyBirthDate: '2026-04-01' });
    expect(statusSpy).toHaveBeenCalledWith(201);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({ exists: true, babyName: 'Nala', babyBirthDate: '2026-04-01' })
    );
  });

  it('returns 400 when babyName is missing', async () => {
    const mockReq = { method: 'POST', url: '/account', body: { babyBirthDate: '2026-04-01' } } as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await accountRouter.stack[1].handle(mockReq, mockRes, () => {});
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'babyName and babyBirthDate are required' });
  });

  it('returns 400 when babyBirthDate is missing', async () => {
    const mockReq = { method: 'POST', url: '/account', body: { babyName: 'Nala' } } as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    await accountRouter.stack[1].handle(mockReq, mockRes, () => {});
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'babyName and babyBirthDate are required' });
  });

  it('returns account data on GET after creation', async () => {
    mocks.mockFindOne.mockImplementation(() => ({
      sort: () => Promise.resolve({ babyName: 'Nala', babyBirthDate: '2026-04-01' }),
    }));

    const mockReq = { method: 'GET', url: '/account' } as any;
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    accountRouter.stack[0].handle(mockReq, mockRes, () => {});
    await new Promise(resolve => setImmediate(resolve));
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ exists: true, babyName: 'Nala', babyBirthDate: '2026-04-01' })
    );
  });
});
