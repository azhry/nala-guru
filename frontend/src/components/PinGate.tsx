import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export function PinGate({ onSuccess }: { onSuccess: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const { validatePin, setPin } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePin(input)) {
      setPin(input);
      onSuccess();
    } else {
      setError('Incorrect PIN. Try again.');
      setInput('');
    }
  };

  return (
    <div className="card text-center max-w-sm mx-auto mt-8">
      <h2 className="text-2xl font-bold text-baby-text mb-2">Parent Dashboard</h2>
      <p className="text-baby-text mb-6">Enter PIN to access</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(''); }}
          className="w-32 text-center text-2xl font-bold px-4 py-3 rounded-xl border-2 border-baby-secondary 
                     focus:outline-none focus:ring-4 focus:ring-baby-accent mx-auto block"
          placeholder="****"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={input.length !== 4}
          className="bg-baby-primary text-white text-lg font-bold px-8 py-3 rounded-2xl
                     active:scale-95 transition-transform disabled:opacity-50"
        >
          Unlock
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-4">Default PIN: 1234</p>
    </div>
  );
}
