import { useProblem } from '../hooks/useProblem';
import { ProblemDisplay } from '../components/ProblemDisplay';
import { FeedbackAnimation } from '../components/FeedbackAnimation';
import { LevelUpCelebration } from '../components/LevelUpCelebration';
import { LEVEL_NAMES } from '../levelNames';

const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'];

export function PlayPage() {
  const { problem, state, result, selectedIndex, error, pickAnswer, nextProblem, currentLevel, levelChanged, newLevel, dismissLevelUp } = useProblem();

  const currentLevelIndex = LEVELS.indexOf(currentLevel);
  const levelName = LEVEL_NAMES[currentLevel] || currentLevel;

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-6xl animate-float">🧮</div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="card text-center soft-shadow">
        <p className="text-xl text-baby-primary mb-4 font-quicksand">{error}</p>
        <button onClick={nextProblem} className="text-baby-secondary underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 px-2">
        <div className="w-12 h-12 bg-baby-primary-container rounded-full flex items-center justify-center text-xl">
          🧮
        </div>
        <div>
          <h1 className="font-quicksand text-headline-lg-mobile text-baby-primary leading-none">Nala</h1>
          <p className="text-sm text-baby-secondary">Level: {levelName}</p>
        </div>
      </header>

      <div className="flex gap-2 items-center">
        {LEVELS.map((lvl, i) => (
          <div
            key={lvl}
            className={`flex-1 h-5 rounded-full transition-all duration-500 ${
              i <= currentLevelIndex ? 'bg-baby-primary soft-shadow' : 'bg-baby-surface-variant/80'
            }`}
          />
        ))}
        <div className="w-8 h-8 -ml-1 bg-white rounded-full border-4 border-baby-primary-container flex items-center justify-center text-sm">
          🧮
        </div>
      </div>

      {state === 'playing' && problem && (
        <div className="card soft-shadow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-baby-primary-container/10 to-transparent pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-24 h-24 animate-float pointer-events-none opacity-30 text-6xl">
            🧮
          </div>
          <ProblemDisplay
            problem={problem}
            selectedIndex={selectedIndex}
            onSelect={pickAnswer}
          />
        </div>
      )}

      {state === 'feedback' && result && (
        <FeedbackAnimation result={result} onNext={nextProblem} />
      )}

      {levelChanged && newLevel && (
        <LevelUpCelebration
          levelName={LEVEL_NAMES[newLevel] || newLevel}
          onDismiss={dismissLevelUp}
        />
      )}
    </div>
  );
}
