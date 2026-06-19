import { useState } from 'react';
import { PlayPage } from './pages/PlayPage';
import { DashboardPage } from './pages/DashboardPage';

type Tab = 'play' | 'dashboard';

export default function App() {
  const [tab, setTab] = useState<Tab>('play');

  return (
    <div className="min-h-screen bg-baby-bg">
      <header className="py-4 text-center">
        <h1 className="text-3xl font-bold text-baby-primary">Baby Math</h1>
        <nav className="mt-2 flex justify-center gap-4">
          <button
            onClick={() => setTab('play')}
            className={`text-lg font-semibold px-4 py-1 rounded-full transition-colors ${
              tab === 'play' ? 'bg-baby-primary text-white' : 'text-baby-text hover:text-baby-primary'
            }`}
          >
            Play
          </button>
          <button
            onClick={() => setTab('dashboard')}
            className={`text-lg font-semibold px-4 py-1 rounded-full transition-colors ${
              tab === 'dashboard' ? 'bg-baby-primary text-white' : 'text-baby-text hover:text-baby-primary'
            }`}
          >
            Dashboard
          </button>
        </nav>
      </header>
      <main className="max-w-2xl mx-auto px-4 pb-8">
        {tab === 'play' ? <PlayPage /> : <DashboardPage />}
      </main>
    </div>
  );
}
