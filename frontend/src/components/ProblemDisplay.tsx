import { motion } from 'framer-motion';
import { Problem } from '../api';

interface Props {
  problem: Problem;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function ProblemDisplay({ problem, selectedIndex, onSelect }: Props) {
  return (
    <div className="text-center px-4">
      <motion.p
        key={problem.problem_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-baby-text mb-8 leading-relaxed font-quicksand"
      >
        {problem.prompt}
      </motion.p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {problem.choices.map((choice, i) => (
          <motion.button
            key={`${problem.problem_id}-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(i)}
            disabled={selectedIndex !== null}
            className={`h-[140px] rounded-xl flex items-center justify-center font-headline-xl text-headline-xl transition-all duration-100 puffy-button ${
              selectedIndex === i
                ? 'bg-baby-primary-container text-baby-on-primary-container'
                : 'bg-baby-secondary-container text-baby-on-secondary-container'
            }`}
          >
            {choice}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
