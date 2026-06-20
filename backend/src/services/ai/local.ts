import crypto from 'crypto';
import { ProblemData } from './provider';
import { t } from './locales';

type TemplateDef = { promptKey: string; choices: string[]; correctIndex: number };

const LEVEL_DEFS: Record<string, TemplateDef[]> = {
  L1: [
    { promptKey: '0', choices: ['1', '3', '5', '2'], correctIndex: 1 },
    { promptKey: '1', choices: ['4', '2', '3', '5'], correctIndex: 2 },
    { promptKey: '2', choices: ['4', '6', '3', '5'], correctIndex: 3 },
    { promptKey: '3', choices: ['4', '3', '5', '2'], correctIndex: 0 },
    { promptKey: '4', choices: ['2', '3', '4', '5'], correctIndex: 2 },
  ],
  L2: [
    { promptKey: '0', choices: ['1', '3', '2', '4'], correctIndex: 2 },
    { promptKey: '1', choices: ['6', '4', '5', '7'], correctIndex: 2 },
    { promptKey: '2', choices: ['4', '6', '3', '5'], correctIndex: 3 },
    { promptKey: '3', choices: ['5', '6', '7', '4'], correctIndex: 1 },
    { promptKey: '4', choices: ['3', '5', '4', '6'], correctIndex: 2 },
  ],
  L3: [
    { promptKey: '0', choices: ['12', '15', '14', '16'], correctIndex: 1 },
    { promptKey: '1', choices: ['14', '16', '15', '13'], correctIndex: 2 },
    { promptKey: '2', choices: ['14', '16', '13', '15'], correctIndex: 3 },
    { promptKey: '3', choices: ['18', '20', '19', '17'], correctIndex: 2 },
    { promptKey: '4', choices: ['16', '18', '15', '17'], correctIndex: 3 },
  ],
  L4: [
    { promptKey: '0', choices: ['2', '4', '1', '3'], correctIndex: 3 },
    { promptKey: '1', choices: ['1', '2', '3', '0'], correctIndex: 1 },
    { promptKey: '2', choices: ['3', '5', '4', '6'], correctIndex: 2 },
    { promptKey: '3', choices: ['4', '6', '3', '5'], correctIndex: 3 },
    { promptKey: '4', choices: ['5', '7', '6', '0'], correctIndex: 2 },
  ],
  L5: [
    { promptKey: '0', choices: ['Square', 'Circle', 'Triangle', 'Star'], correctIndex: 2 },
    { promptKey: '1', choices: ['Triangle', 'Square', 'Star', 'Circle'], correctIndex: 3 },
    { promptKey: '2', choices: ['Circle', 'Triangle', 'Square', 'Star'], correctIndex: 2 },
    { promptKey: '3', choices: ['Square', 'Star', 'Triangle', 'Circle'], correctIndex: 1 },
    { promptKey: '4', choices: ['Square', 'Triangle', 'Circle', 'Oval'], correctIndex: 3 },
  ],
};

function build(level: string, def: TemplateDef, locale?: string): ProblemData {
  const strings = t(locale || 'en');
  const key = `${level}_${def.promptKey}` as keyof typeof strings.local;
  const prompt = (strings.local[key] as string) || '';
  return {
    problemId: crypto.randomUUID(),
    prompt,
    choices: def.choices,
    correctIndex: def.correctIndex,
    level,
  };
}

export class LocalProvider {
  name = 'local';

  generateProblem(level: string, locale?: string): ProblemData {
    const defs = LEVEL_DEFS[level];
    if (!defs || defs.length === 0) {
      throw new Error(`Unknown level: ${level}`);
    }
    const index = Math.floor(Math.random() * defs.length);
    return build(level, defs[index], locale);
  }
}
