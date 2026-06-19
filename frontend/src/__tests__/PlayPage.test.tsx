import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayPage } from '../pages/PlayPage';

const mockProblem = {
  problem_id: 'test-123',
  prompt: 'What is 1 + 1?',
  choices: ['1', '2', '3', '4'],
  correct_index: 1,
  level: 'L1',
};

const mockCorrectAnswer = {
  correct: true,
  guide_text: 'Great job!',
  guide_visuals: ['star-burst'],
};

const mockWrongAnswer = {
  correct: false,
  guide_text: 'Count each item slowly.',
  guide_visuals: ['counting-fingers', 'dots-visual'],
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

describe('PlayPage - FE-001', () => {
  it('shows loading state on mount', () => {
    mockFetchOnce(mockProblem);
    render(<PlayPage />);
    expect(screen.getByText('🧮')).toBeDefined();
  });

  it('renders problem after loading completes', async () => {
    mockFetchOnce(mockProblem);
    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });

    mockProblem.choices.forEach((choice) => {
      expect(screen.getByText(choice)).toBeDefined();
    });
  });

  it('renders 4 answer buttons with correct text', async () => {
    mockFetchOnce(mockProblem);
    render(<PlayPage />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
      expect(buttons[0]).toHaveTextContent('1');
      expect(buttons[1]).toHaveTextContent('2');
      expect(buttons[2]).toHaveTextContent('3');
      expect(buttons[3]).toHaveTextContent('4');
    });
  });

  it('shows correct feedback when selecting correct answer', async () => {
    const fetchMock = mockFetchOnce(mockProblem);
    mockFetchOnce(mockCorrectAnswer);

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });

    const buttons = screen.getAllByRole('button');

    await act(async () => {
      buttons[1].click();
    });

    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeDefined();
    });
  });

  it('shows guide text when selecting wrong answer', async () => {
    mockFetchOnce(mockProblem);
    mockFetchOnce(mockWrongAnswer);

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });

    const buttons = screen.getAllByRole('button');

    await act(async () => {
      buttons[0].click();
    });

    await waitFor(() => {
      expect(screen.getByText('Not quite!')).toBeDefined();
      expect(screen.getByText('Count each item slowly.')).toBeDefined();
    });
  });

  it('shows Next Problem button after feedback', async () => {
    mockFetchOnce(mockProblem);
    mockFetchOnce(mockCorrectAnswer);

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });

    const buttons = screen.getAllByRole('button');

    await act(async () => {
      buttons[1].click();
    });

    await waitFor(() => {
      expect(screen.getByText('Next Problem')).toBeDefined();
    });
  });

  it('loads next problem after clicking Next Problem', async () => {
    mockFetchOnce(mockProblem);
    mockFetchOnce(mockCorrectAnswer);
    mockFetchOnce({ ...mockProblem, problem_id: 'test-456', prompt: 'What is 2 + 2?' });

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });

    const buttons = screen.getAllByRole('button');

    await act(async () => {
      buttons[1].click();
    });

    await waitFor(() => {
      expect(screen.getByText('Next Problem')).toBeDefined();
    });

    const nextButton = screen.getByText('Next Problem');

    await act(async () => {
      nextButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('What is 2 + 2?')).toBeDefined();
    });
  });

  it('shows error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load problem')).toBeDefined();
    });

    expect(screen.getByText('Try again')).toBeDefined();
  });

  it('retries after error state', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    mockFetchOnce(mockProblem);

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load problem')).toBeDefined();
    });

    const tryAgain = screen.getByText('Try again');

    await act(async () => {
      tryAgain.click();
    });

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });
  });

  it('disables buttons after selection', async () => {
    mockFetchOnce(mockProblem);
    mockFetchOnce(mockCorrectAnswer);

    render(<PlayPage />);

    await waitFor(() => {
      expect(screen.getByText('What is 1 + 1?')).toBeDefined();
    });

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).not.toBeDisabled();

    await act(async () => {
      buttons[1].click();
    });

    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeDefined();
    });
  });
});
