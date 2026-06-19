import { useState } from 'react';
import { motion } from 'framer-motion';
import { createAccount } from '../api';

interface OnboardingPageProps {
  onComplete: () => void;
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [babyName, setBabyName] = useState('');
  const [babyBirthDate, setBabyBirthDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = babyName.trim().length > 0 && babyBirthDate.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    try {
      await createAccount(babyName.trim(), babyBirthDate.trim());
      localStorage.setItem('baby-math-onboarding', 'complete');
      onComplete();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-baby-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-baby-primary text-center mb-2">
          Ready for your first math adventure?
        </h1>
        <p className="text-baby-text text-center mb-6">
          Tell us about your little one to get started!
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="babyName" className="block text-sm font-semibold text-baby-text mb-1">
              Baby's Name
            </label>
            <input
              id="babyName"
              type="text"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              placeholder="e.g. Nala"
              className="w-full px-4 py-3 rounded-xl border border-baby-accent/30 text-lg focus:outline-none focus:ring-2 focus:ring-baby-primary"
            />
          </div>

          <div>
            <label htmlFor="babyBirthDate" className="block text-sm font-semibold text-baby-text mb-1">
              Baby's Birth Date
            </label>
            <input
              id="babyBirthDate"
              type="date"
              value={babyBirthDate}
              onChange={(e) => setBabyBirthDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-baby-accent/30 text-lg focus:outline-none focus:ring-2 focus:ring-baby-primary"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || saving}
            className="w-full py-4 rounded-2xl text-xl font-bold text-white bg-baby-primary disabled:opacity-50 active:scale-95 transition-transform"
          >
            {saving ? 'Saving...' : 'Start Playing!'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
