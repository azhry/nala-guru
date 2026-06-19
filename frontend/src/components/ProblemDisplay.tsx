import { motion } from 'framer-motion';
import { Problem } from '../api';

interface Props {
  problem: Problem;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];

export function ProblemDisplay({ problem, selectedIndex, onSelect }: Props) {
  return (
    <div className="text-center px-4">
      <motion.p
        key={problem.problem_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-baby-text mb-8 leading-relaxed"
      >
        {problem.prompt}
      </motion.p>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {problem.choices.map((choice, i) => (
          <motion.button
            key={`${problem.problem_id}-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(i)}
            disabled={selectedIndex !== null}
            className={
              selectedIndex === i
                ? 'btn-answer-selected'
                : 'btn-answer-default'
            }
            style={{
              borderColor: COLORS[i],
              backgroundColor: selectedIndex === i ? COLORS[i] : undefined,
            }}
          >
            {choice}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
