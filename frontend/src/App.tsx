import { useState } from 'react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { PinGate } from './components/PinGate';
import { PlayPage } from './pages/PlayPage';
import { DashboardPage } from './pages/DashboardPage';

type Tab = 'play' | 'dashboard';

function SettingsBar() {
  const { muted, toggleMute, highContrast, toggleHighContrast } = useSettings();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-xl p-2 rounded-full hover:bg-baby-accent/30 transition-colors"
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
      <button
        onClick={toggleHighContrast}
        className="text-xl p-2 rounded-full hover:bg-baby-accent/30 transition-colors"
        aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
        title={highContrast ? 'High Contrast: On' : 'High Contrast: Off'}
      >
        {highContrast ? '◑' : '◐'}
      </button>
    </div>
  );
}

function AppContent() {
  const [tab, setTab] = useState<Tab>('play');
  const { pin } = useSettings();
  const [pinAccepted, setPinAccepted] = useState(false);

  const handleDashboardClick = () => {
    setTab('dashboard');
    setPinAccepted(false);
  };

  return (
    <div className="min-h-screen bg-baby-bg">
      <header className="py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-baby-primary">Baby Math</h1>
          <SettingsBar />
        </div>
        <nav className="mt-2 flex justify-center gap-3 sm:gap-4">
          <button
            onClick={() => setTab('play')}
            className={`text-base sm:text-lg font-semibold px-4 sm:px-6 py-1.5 rounded-full transition-colors ${
              tab === 'play' ? 'bg-baby-primary text-white' : 'text-baby-text hover:text-baby-primary'
            }`}
          >
            Play
          </button>
          <button
            onClick={handleDashboardClick}
            className={`text-base sm:text-lg font-semibold px-4 sm:px-6 py-1.5 rounded-full transition-colors ${
              tab === 'dashboard' && (pin || pinAccepted) ? 'bg-baby-primary text-white' : 'text-baby-text hover:text-baby-primary'
            }`}
          >
            Dashboard
          </button>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pb-8">
        {tab === 'play' ? (
          <PlayPage />
        ) : pin ? (
          <DashboardPage />
        ) : pinAccepted ? (
          <DashboardPage />
        ) : (
          <PinGate onSuccess={() => setPinAccepted(true)} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
