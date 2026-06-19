import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DashboardPage } from '../pages/DashboardPage';

const mockPerformance = {
  currentLevel: 'addition_1',
  accuracyByLevel: [
    { level: 'counting', total: 10, correct: 8, accuracy: 80 },
    { level: 'addition_1', total: 5, correct: 3, accuracy: 60 },
  ],
  sessions: [
    { problemId: 'p1', correct: true, level: 'counting', timestamp: '2026-06-19T03:00:00Z' },
    { problemId: 'p2', correct: false, level: 'addition_1', timestamp: '2026-06-19T03:01:00Z' },
    { problemId: 'p3', correct: true, level: 'addition_1', timestamp: '2026-06-19T03:02:00Z' },
  ],
  streak: 3,
  totalSessions: 15,
};

function mockFetchOnce(data: unknown) {
  return vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  } as Response);
}

beforeEach(() => {
  vi.resetAllMocks();
  globalThis.fetch = vi.fn();
});

describe('DashboardPage - FE-002', () => {
  it('shows loading state on mount', () => {
    render(<DashboardPage />);
    expect(screen.getByText('📊')).toBeDefined();
  });

  it('renders current level after loading', async () => {
    mockFetchOnce(mockPerformance);
    render(<DashboardPage />);

    await waitFor(() => {
      const els = screen.getAllByText('Addition (Basic)');
      expect(els.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders accuracy bars for each level', async () => {
    mockFetchOnce(mockPerformance);
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Counting').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Addition (Basic)').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('80%')).toBeDefined();
      expect(screen.getByText('60%')).toBeDefined();
    });
  });

  it('renders streak and total sessions', async () => {
    mockFetchOnce(mockPerformance);
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Current Streak')).toBeDefined();
      expect(screen.getByText('Total Sessions')).toBeDefined();
    });
  });

  it('renders recent session list', async () => {
    mockFetchOnce(mockPerformance);
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Recent Sessions')).toBeDefined();
      const items = screen.getAllByText(/Counting|Addition/);
      expect(items.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('shows error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load performance data')).toBeDefined();
    });
  });

  it('retries after error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    mockFetchOnce(mockPerformance);
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load performance data')).toBeDefined();
    });

    const tryAgain = screen.getByText('Try again');
    await act(async () => {
      tryAgain.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Accuracy by Level')).toBeDefined();
    });
  });

  it('shows empty state when no sessions', async () => {
    const empty = {
      ...mockPerformance,
      accuracyByLevel: [],
      sessions: [],
      streak: 0,
      totalSessions: 0,
    };
    mockFetchOnce(empty);
    render(<DashboardPage />);

    await waitFor(() => {
      const els = screen.getAllByText('No sessions recorded yet.');
      expect(els.length).toBeGreaterThanOrEqual(1);
    });
  });
});
