import { motion, AnimatePresence } from 'framer-motion';
import { AnswerResult } from '../api';

interface Props {
  result: AnswerResult;
  onNext: () => void;
}

const emojis = ['🌟', '🎉', '⭐', '👏', '💪'];

export function FeedbackAnimation({ result, onNext }: Props) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="card text-center space-y-6"
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
            <p className="text-2xl font-bold text-green-500">Correct!</p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-baby-primary">Not quite!</p>
            <div className="bg-baby-bg rounded-2xl p-4">
              <p className="text-lg">{result.guide_text}</p>
            </div>
          </>
        )}

        <button
          onClick={onNext}
          className="bg-baby-primary text-white text-xl font-bold px-8 py-4 rounded-2xl 
                     active:scale-95 transition-transform"
        >
          Next Problem
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
