import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnswerResult } from '../api';

interface Props {
  result: AnswerResult;
  onNext: () => void;
}

const emojis = ['🌟', '🎉', '⭐', '👏', '💪'];
const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A78BFA', '#FF9FF3', '#F97316'];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  drift: number;
}

function createConfetti(): ConfettiPiece[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.5,
    size: 5 + Math.random() * 8,
    drift: (Math.random() - 0.5) * 80,
  }));
}

export function FeedbackAnimation({ result, onNext }: Props) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const confetti = useMemo(() => result.correct ? createConfetti() : [], [result.correct]);
  const [phase, setPhase] = useState<'feedback' | 'countdown'>('feedback');
  const [count, setCount] = useState(3);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    setPhase('feedback');
    setCount(3);
    setGuideOpen(false);

    const feedbackTimer = setTimeout(() => setPhase('countdown'), 2000);
    return () => clearTimeout(feedbackTimer);
  }, [result]);

  useEffect(() => {
    if (phase !== 'countdown') return;

    if (count <= 0) {
      onNext();
      return;
    }

    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, count, onNext]);

  useEffect(() => {
    if (!result.correct) {
      const t = setTimeout(() => setGuideOpen(true), 300);
      return () => clearTimeout(t);
    }
  }, [result.correct]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="card text-center space-y-6 soft-shadow relative overflow-hidden"
      >
        {result.correct && confetti.map((c) => (
          <div
            key={c.id}
            className="absolute pointer-events-none"
            style={{
              left: `${c.x}%`,
              top: '-5%',
              width: c.size,
              height: c.size * 0.6,
              backgroundColor: c.color,
              borderRadius: '2px',
              animation: `confetti-fall 2s ${c.delay}s ease-in forwards`,
              ['--drift' as string]: `${c.drift}px`,
            }}
          />
        ))}

        {result.correct ? (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl relative z-10"
            >
              {emoji}
            </motion.div>
            <p className="text-2xl font-bold text-baby-tertiary font-quicksand relative z-10">Correct!</p>
          </>
        ) : (
          <>
            <div className="animate-shake inline-block rounded-xl p-4">
              <p className="text-2xl font-bold text-baby-error font-quicksand">Not quite!</p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: guideOpen ? 1 : 0, y: guideOpen ? 0 : 50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-baby-surface-container rounded-2xl p-5 text-left overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <p className="font-bold text-baby-primary font-quicksand mb-1">How To Solve</p>
                  <p className="text-base">{result.guide_text}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {phase === 'countdown' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-baby-on-surface-variant relative z-10"
          >
            Next problem in {count}...
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
