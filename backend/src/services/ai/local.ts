import crypto from 'crypto';
import { ProblemData } from './provider';

const countingTemplates: Array<() => ProblemData> = [
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'How many apples are there? 🍎🍎🍎',
    choices: ['1', '3', '5', '2'],
    correctIndex: 1,
    level: 'counting',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Count the stars: ⭐⭐⭐',
    choices: ['4', '2', '3', '5'],
    correctIndex: 2,
    level: 'counting',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'How many fingers are on one hand?',
    choices: ['4', '6', '3', '5'],
    correctIndex: 3,
    level: 'counting',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Count the balloons: 🎈🎈🎈🎈',
    choices: ['4', '3', '5', '2'],
    correctIndex: 0,
    level: 'counting',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'How many legs does a cat have?',
    choices: ['2', '3', '4', '5'],
    correctIndex: 2,
    level: 'counting',
  }),
];

const addition1Templates: Array<() => ProblemData> = [
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 1 + 1?',
    choices: ['1', '3', '2', '4'],
    correctIndex: 2,
    level: 'addition_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 2 + 3?',
    choices: ['6', '4', '5', '7'],
    correctIndex: 2,
    level: 'addition_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 4 + 1?',
    choices: ['4', '6', '3', '5'],
    correctIndex: 3,
    level: 'addition_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 3 + 3?',
    choices: ['5', '6', '7', '4'],
    correctIndex: 1,
    level: 'addition_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 2 + 2?',
    choices: ['3', '5', '4', '6'],
    correctIndex: 2,
    level: 'addition_1',
  }),
];

const addition2Templates: Array<() => ProblemData> = [
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 10 + 5?',
    choices: ['12', '15', '14', '16'],
    correctIndex: 1,
    level: 'addition_2',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 7 + 8?',
    choices: ['14', '16', '15', '13'],
    correctIndex: 2,
    level: 'addition_2',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 9 + 6?',
    choices: ['14', '16', '13', '15'],
    correctIndex: 3,
    level: 'addition_2',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 12 + 7?',
    choices: ['18', '20', '19', '17'],
    correctIndex: 2,
    level: 'addition_2',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 8 + 9?',
    choices: ['16', '18', '15', '17'],
    correctIndex: 3,
    level: 'addition_2',
  }),
];

const subtraction1Templates: Array<() => ProblemData> = [
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 5 - 2?',
    choices: ['2', '4', '1', '3'],
    correctIndex: 3,
    level: 'subtraction_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 3 - 1?',
    choices: ['1', '2', '3', '0'],
    correctIndex: 1,
    level: 'subtraction_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 7 - 3?',
    choices: ['3', '5', '4', '6'],
    correctIndex: 2,
    level: 'subtraction_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 9 - 4?',
    choices: ['4', '6', '3', '5'],
    correctIndex: 3,
    level: 'subtraction_1',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'What is 6 - 0?',
    choices: ['5', '7', '6', '0'],
    correctIndex: 2,
    level: 'subtraction_1',
  }),
];

const shapesTemplates: Array<() => ProblemData> = [
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Which shape has 3 sides?',
    choices: ['Square', 'Circle', 'Triangle', 'Star'],
    correctIndex: 2,
    level: 'shapes',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Which shape is round?',
    choices: ['Triangle', 'Square', 'Star', 'Circle'],
    correctIndex: 3,
    level: 'shapes',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Which shape has 4 equal sides?',
    choices: ['Circle', 'Triangle', 'Square', 'Star'],
    correctIndex: 2,
    level: 'shapes',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Which shape has 5 points?',
    choices: ['Square', 'Star', 'Triangle', 'Circle'],
    correctIndex: 1,
    level: 'shapes',
  }),
  () => ({
    problemId: crypto.randomUUID(),
    prompt: 'Which shape looks like an egg?',
    choices: ['Square', 'Triangle', 'Circle', 'Oval'],
    correctIndex: 3,
    level: 'shapes',
  }),
];

const templatesByLevel: Record<string, Array<() => ProblemData>> = {
  counting: countingTemplates,
  addition_1: addition1Templates,
  addition_2: addition2Templates,
  subtraction_1: subtraction1Templates,
  shapes: shapesTemplates,
};

export class LocalProvider {
  name = 'local';

  generateProblem(level: string): ProblemData {
    const templates = templatesByLevel[level];
    if (!templates || templates.length === 0) {
      throw new Error(`Unknown level: ${level}`);
    }
    const index = Math.floor(Math.random() * templates.length);
    return templates[index]();
  }
}
