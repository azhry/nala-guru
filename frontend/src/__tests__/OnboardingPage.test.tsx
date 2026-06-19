import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingPage } from '../pages/OnboardingPage';

const mockCreateAccount = vi.fn();

vi.mock('../api', () => ({
  createAccount: (...args: any[]) => mockCreateAccount(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe('OnboardingPage', () => {
  it('renders the onboarding title', () => {
    render(<OnboardingPage onComplete={() => {}} />);
    expect(screen.getByText('Ready for your first math adventure?')).toBeDefined();
  });

  it('renders name and date inputs', () => {
    render(<OnboardingPage onComplete={() => {}} />);
    expect(screen.getByLabelText("Baby's Name")).toBeDefined();
    expect(screen.getByLabelText("Baby's Birth Date")).toBeDefined();
  });

  it('disables submit button when fields are empty', () => {
    render(<OnboardingPage onComplete={() => {}} />);
    const button = screen.getByText('Start Playing!') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('enables submit when both fields filled', () => {
    render(<OnboardingPage onComplete={() => {}} />);
    fireEvent.change(screen.getByLabelText("Baby's Name"), { target: { value: 'Nala' } });
    fireEvent.change(screen.getByLabelText("Baby's Birth Date"), { target: { value: '2026-04-01' } });
    const button = screen.getByText('Start Playing!') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });

  it('calls createAccount and onComplete on submit', async () => {
    mockCreateAccount.mockResolvedValueOnce({ exists: true });
    const onComplete = vi.fn();
    render(<OnboardingPage onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText("Baby's Name"), { target: { value: 'Nala' } });
    fireEvent.change(screen.getByLabelText("Baby's Birth Date"), { target: { value: '2026-04-01' } });
    fireEvent.click(screen.getByText('Start Playing!'));
    await waitFor(() => {
      expect(mockCreateAccount).toHaveBeenCalledWith('Nala', '2026-04-01');
    });
    expect(onComplete).toHaveBeenCalled();
  });
});
