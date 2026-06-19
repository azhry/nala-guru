import { useProblem } from '../hooks/useProblem';
import { ProblemDisplay } from '../components/ProblemDisplay';
import { FeedbackAnimation } from '../components/FeedbackAnimation';

export function PlayPage() {
  const { problem, state, result, selectedIndex, error, pickAnswer, nextProblem } = useProblem();

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-4xl animate-bounce">🧮</div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="card text-center">
        <p className="text-xl text-baby-primary mb-4">{error}</p>
        <button onClick={nextProblem} className="text-baby-secondary underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {state === 'playing' && problem && (
        <ProblemDisplay
          problem={problem}
          selectedIndex={selectedIndex}
          onSelect={pickAnswer}
        />
      )}

      {state === 'feedback' && result && (
        <FeedbackAnimation result={result} onNext={nextProblem} />
      )}
    </div>
  );
}
