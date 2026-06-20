import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  vi.resetAllMocks();
  globalThis.fetch = vi.fn();
  localStorage.clear();
  localStorage.setItem('baby-math-onboarding', 'complete');
  document.documentElement.classList.remove('high-contrast');
});

const sampleProblem = {
  problem_id: 'p1',
  prompt: 'What is 1 + 1?',
  choices: ['1', '2', '3', '4'],
  correct_index: 1,
  level: 'L1',
};

const samplePerformance = {
  currentLevel: 'L2',
  accuracyByLevel: [
    { level: 'L1', total: 10, correct: 8, accuracy: 80 },
  ],
  sessions: [
    { problemId: 'p1', correct: true, level: 'L1', timestamp: '2026-06-19T03:00:00Z' },
  ],
  streak: 3,
  totalSessions: 15,
};

function mockSmart() {
  vi.mocked(fetch).mockImplementation((url: string) => {
    if (url.includes('/api/problem')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(sampleProblem),
      } as Response);
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(samplePerformance),
    } as Response);
  });
}

describe('App - FE-003', () => {
  it('renders Play tab by default', () => {
    render(<App />);
    expect(screen.getByText('Baby Math')).toBeDefined();
    expect(screen.getByText('Play')).toBeDefined();
    expect(screen.getByText('Dashboard')).toBeDefined();
  });

  it('shows PIN gate when navigating to Dashboard', async () => {
    render(<App />);
    const dashboardBtn = screen.getByText('Dashboard');
    await act(async () => {
      dashboardBtn.click();
    });
    expect(screen.getByText('Enter PIN to access')).toBeDefined();
  });

  it('accepts correct PIN and shows Dashboard', async () => {
    mockSmart();
    render(<App />);

    const dashboardBtn = screen.getByText('Dashboard');
    await act(async () => {
      dashboardBtn.click();
    });

    const input = screen.getByPlaceholderText('****');
    fireEvent.change(input, { target: { value: '1234' } });

    const unlockBtn = screen.getByText('Unlock');
    await act(async () => {
      unlockBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Accuracy by Level')).toBeDefined();
    });
  });

  it('rejects wrong PIN', async () => {
    render(<App />);
    const dashboardBtn = screen.getByText('Dashboard');
    await act(async () => {
      dashboardBtn.click();
    });

    const input = screen.getByPlaceholderText('****');
    fireEvent.change(input, { target: { value: '0000' } });

    const unlockBtn = screen.getByText('Unlock');
    await act(async () => {
      unlockBtn.click();
    });

    expect(screen.getByText('Incorrect PIN. Try again.')).toBeDefined();
  });

  it('toggles mute button', () => {
    render(<App />);
    const muteBtn = screen.getByLabelText('Mute sound');
    expect(muteBtn).toBeDefined();

    act(() => {
      muteBtn.click();
    });
    expect(screen.getByLabelText('Unmute sound')).toBeDefined();
    expect(localStorage.getItem('baby-math-muted')).toBe('true');
  });

  it('toggles high-contrast mode', () => {
    render(<App />);
    const contrastBtn = screen.getByLabelText('Enable high contrast');
    expect(contrastBtn).toBeDefined();

    act(() => {
      contrastBtn.click();
    });
    expect(screen.getByLabelText('Disable high contrast')).toBeDefined();
    expect(localStorage.getItem('baby-math-high-contrast')).toBe('true');
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('toggles language preference', () => {
    render(<App />);
    const langBtn = screen.getByLabelText('Switch to Indonesian');
    expect(langBtn).toBeDefined();

    act(() => {
      langBtn.click();
    });

    expect(screen.getByLabelText('Switch to English')).toBeDefined();
    expect(localStorage.getItem('baby-math-locale')).toBe('id');
  });

  it('navigates back to Play from Dashboard', async () => {
    mockSmart();
    render(<App />);

    const dashboardBtn = screen.getByText('Dashboard');
    await act(async () => {
      dashboardBtn.click();
    });

    const input = screen.getByPlaceholderText('****');
    fireEvent.change(input, { target: { value: '1234' } });

    const unlockBtn = screen.getByText('Unlock');
    await act(async () => {
      unlockBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Accuracy by Level')).toBeDefined();
    });

    const playBtn = screen.getByText('Play');
    await act(async () => {
      playBtn.click();
    });

    await waitFor(() => {
      expect(screen.getByText(sampleProblem.prompt)).toBeDefined();
    });
  });

  it('disables unlock button when PIN is incomplete', async () => {
    render(<App />);
    const dashboardBtn = screen.getByText('Dashboard');
    await act(async () => {
      dashboardBtn.click();
    });

    const unlockBtn = screen.getByText('Unlock');
    expect(unlockBtn).toBeDisabled();
  });

  it('shows onboarding page when not onboarded', () => {
    localStorage.removeItem('baby-math-onboarding');
    render(<App />);
    expect(screen.getByText('Ready for your first math adventure?')).toBeDefined();
  });

  it('hides onboarding after completion', () => {
    localStorage.removeItem('baby-math-onboarding');
    render(<App />);
    expect(screen.getByText('Ready for your first math adventure?')).toBeDefined();

    localStorage.setItem('baby-math-onboarding', 'complete');
    const { unmount } = render(<App />);
    unmount();

    localStorage.setItem('baby-math-onboarding', 'complete');
    render(<App />);
    expect(screen.getByText('Baby Math')).toBeDefined();
  });
});
