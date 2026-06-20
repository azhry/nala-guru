import { useState } from 'react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { PinGate } from './components/PinGate';
import { PlayPage } from './pages/PlayPage';
import { DashboardPage } from './pages/DashboardPage';
import { OnboardingPage } from './pages/OnboardingPage';

type Tab = 'play' | 'dashboard';

function SettingsBar() {
  const { muted, toggleMute, highContrast, toggleHighContrast, locale, toggleLocale } = useSettings();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full bg-baby-surface-container-high flex items-center justify-center hover:bg-baby-primary-container/20 transition-colors active:scale-95 duration-150"
        aria-label={muted ? 'Unmute sound' : 'Mute sound'}
        title={muted ? 'Unmute' : 'Mute'}
        >
          <span className="text-xl">{muted ? '🔇' : '🔊'}</span>
      </button>
      <button
        onClick={toggleLocale}
        className="w-12 h-12 rounded-full bg-baby-surface-container-high flex items-center justify-center hover:bg-baby-primary-container/20 transition-colors active:scale-95 duration-150 font-quicksand font-bold text-sm"
        aria-label={locale === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
        title={locale === 'en' ? 'Language: EN' : 'Language: ID'}
      >
        <span>{locale.toUpperCase()}</span>
      </button>
      <button
        onClick={toggleHighContrast}
        className="w-12 h-12 rounded-full bg-baby-surface-container-high flex items-center justify-center hover:bg-baby-primary-container/20 transition-colors active:scale-95 duration-150"
        aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
        title={highContrast ? 'High Contrast: On' : 'High Contrast: Off'}
      >
        <span className="text-xl">{highContrast ? '◑' : '◐'}</span>
      </button>
    </div>
  );
}

function AppContent() {
  const [onboarded, setOnboarded] = useState(() => localStorage.getItem('baby-math-onboarding') === 'complete');
  const [tab, setTab] = useState<Tab>('play');
  const { pin, locale } = useSettings();
  const [pinAccepted, setPinAccepted] = useState(false);

  if (!onboarded) {
    return <OnboardingPage onComplete={() => setOnboarded(true)} />;
  }

  const handleDashboardClick = () => {
    setTab('dashboard');
    setPinAccepted(false);
  };

  return (
    <div className="min-h-screen bg-baby-bg pb-24">
      <header className="sticky top-0 z-40 bg-baby-surface/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-touch px-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-baby-primary-container rounded-full flex items-center justify-center text-xl">
              🧮
            </div>
            <h1 className="font-quicksand text-headline-lg-mobile text-baby-primary leading-none">Baby Math</h1>
          </div>
          <SettingsBar />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 pb-8 pt-4">
        {tab === 'play' ? (
          <PlayPage locale={locale} />
        ) : pin ? (
          <DashboardPage />
        ) : pinAccepted ? (
          <DashboardPage />
        ) : (
          <PinGate onSuccess={() => setPinAccepted(true)} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-baby-surface-container-lowest shadow-[0_-4px_20px_0_rgba(0,0,0,0.05)] rounded-t-lg">
        <button
          onClick={() => setTab('play')}
          className={`flex flex-col items-center justify-center px-6 py-3 transition-all duration-200 ${
            tab === 'play'
              ? 'bg-baby-primary-container text-baby-on-primary-container rounded-xl'
              : 'text-baby-on-surface-variant hover:bg-baby-surface-container-high transition-colors'
          }`}
        >
          <span className="text-3xl material-symbols-outlined">charging_station</span>
          <span className="text-sm mt-1 font-nunito-sans font-bold">Play</span>
        </button>
        <button
          onClick={handleDashboardClick}
          className={`flex flex-col items-center justify-center px-6 py-3 transition-all duration-200 ${
            tab === 'dashboard' && (pin || pinAccepted)
              ? 'bg-baby-primary-container text-baby-on-primary-container rounded-xl'
              : 'text-baby-on-surface-variant hover:bg-baby-surface-container-high transition-colors'
          }`}
        >
          <span className="text-3xl material-symbols-outlined">leaderboard</span>
          <span className="text-sm mt-1 font-nunito-sans font-bold">Dashboard</span>
        </button>
      </nav>
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
