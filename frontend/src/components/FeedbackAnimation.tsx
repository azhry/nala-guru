import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnswerResult } from '../api';

interface Props {
  result: AnswerResult;
  onNext: () => void;
}

const emojis = ['🌟', '🎉', '⭐', '👏', '💪'];

export function FeedbackAnimation({ result, onNext }: Props) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  const [phase, setPhase] = useState<'feedback' | 'countdown'>('feedback');
  const [count, setCount] = useState(3);

  useEffect(() => {
    setPhase('feedback');
    setCount(3);

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="card text-center space-y-6 soft-shadow"
      >
        {result.correct ? (
          <>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
              className="text-6xl"
            >
              {emoji}
            </motion.div>
            <p className="text-2xl font-bold text-baby-tertiary font-quicksand">Correct!</p>
          </>
        ) : (
          <>
            <div className="animate-shake inline-block rounded-xl p-4">
              <p className="text-2xl font-bold text-baby-error font-quicksand">Not quite!</p>
            </div>
            <div className="bg-baby-surface-container rounded-2xl p-4">
              <p className="text-lg">{result.guide_text}</p>
            </div>
          </>
        )}

        {phase === 'countdown' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg text-baby-on-surface-variant"
          >
            Next problem in {count}...
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
