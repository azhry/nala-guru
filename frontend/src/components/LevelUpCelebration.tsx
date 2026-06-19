import { useEffect, useState, useMemo } from 'react';

interface LevelUpCelebrationProps {
  levelName: string;
  onDismiss: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
  drift: number;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A78BFA', '#FF9FF3', '#F97316'];

function createConfetti(): ConfettiPiece[] {
  return Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 0.8,
    rotation: Math.random() * 720 - 360,
    size: 6 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 100,
  }));
}

export function LevelUpCelebration({ levelName, onDismiss }: LevelUpCelebrationProps) {
  const confetti = useMemo(createConfetti, []);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  function handleDismiss() {
    setVisible(false);
    setTimeout(onDismiss, 400);
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-400 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-black/40" onClick={handleDismiss} />
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: '-5%',
            width: c.size,
            height: c.size * 0.6,
            backgroundColor: c.color,
            borderRadius: '2px',
            animation: `confetti-fall 2.5s ${c.delay}s ease-in forwards`,
            transform: `rotate(${c.rotation}deg)`,
            ['--drift' as string]: `${c.drift}px`,
          }}
        />
      ))}
      <div
        className={`relative bg-white rounded-2xl p-8 text-center shadow-2xl transition-all duration-300 ${
          visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-baby-primary mb-2">Level Up!</h2>
        <p className="text-xl text-baby-text">You reached {levelName}!</p>
        <button
          onClick={handleDismiss}
          className="mt-6 px-8 py-3 bg-baby-primary text-white rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
        >
          Keep Playing!
        </button>
      </div>
    </div>
  );
}
