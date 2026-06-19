import { LEVEL_NAMES } from '../levelNames';

interface LevelIndicatorProps {
  level: string;
}

const LEVEL_STARS: Record<string, number> = {
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
  L5: 5,
};

export function LevelIndicator({ level }: LevelIndicatorProps) {
  const name = LEVEL_NAMES[level] || level;
  const starCount = LEVEL_STARS[level] || 1;

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`text-xl ${i < starCount ? 'opacity-100' : 'opacity-20'}`}
          >
            ⭐
          </span>
        ))}
      </div>
      <span className="text-lg font-bold text-baby-text">{name}</span>
    </div>
  );
}
