import { PlayPage } from './pages/PlayPage';

export default function App() {
  return (
    <div className="min-h-screen bg-baby-bg">
      <header className="py-4 text-center">
        <h1 className="text-3xl font-bold text-baby-primary">Baby Math</h1>
      </header>
      <main className="max-w-2xl mx-auto px-4 pb-8">
        <PlayPage />
      </main>
    </div>
  );
}
