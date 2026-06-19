import { usePerformance } from '../hooks/usePerformance';

import { LEVEL_NAMES } from '../levelNames';

const LEVEL_COLORS: Record<string, string> = {
  L1: '#FF6B6B',
  L2: '#4ECDC4',
  L3: '#FFE66D',
  L4: '#95E1D3',
  L5: '#A78BFA',
};

function AccuracyBar({ level, accuracy }: { level: string; accuracy: number }) {
  const label = LEVEL_NAMES[level] || level;
  const color = LEVEL_COLORS[level] || '#4ECDC4';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-baby-text">{label}</span>
        <span className="text-baby-text">{accuracy}%</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${accuracy}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { data, loading, error, reload } = usePerformance();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-4xl animate-bounce">📊</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="card text-center">
        <p className="text-xl text-baby-primary mb-4">{error || 'No data'}</p>
        <button onClick={reload} className="text-baby-secondary underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-baby-text mb-2">Current Level</h2>
        <p className="text-4xl font-bold text-baby-primary">
          {LEVEL_NAMES[data.currentLevel] || data.currentLevel}
        </p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-baby-text mb-4">Accuracy by Level</h2>
        {data.accuracyByLevel.length === 0 ? (
          <p className="text-baby-text">No sessions recorded yet.</p>
        ) : (
          data.accuracyByLevel.map((a) => (
            <AccuracyBar key={a.level} level={a.level} accuracy={a.accuracy} />
          ))
        )}
      </div>

      <div className="card">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-baby-primary">{data.streak}</p>
            <p className="text-sm text-baby-text">Current Streak</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-baby-secondary">{data.totalSessions}</p>
            <p className="text-sm text-baby-text">Total Sessions</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-baby-text mb-4">Recent Sessions</h2>
        {data.sessions.length === 0 ? (
          <p className="text-baby-text">No sessions recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {data.sessions.slice(0, 10).map((s) => (
              <div
                key={s.problemId + s.timestamp}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className={s.correct ? 'text-green-500' : 'text-red-400'}>
                    {s.correct ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-baby-text">
                    {LEVEL_NAMES[s.level] || s.level}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(s.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
