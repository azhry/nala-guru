import crypto from 'crypto';
import { execSync } from 'child_process';
import { AIProvider, ProblemData } from './provider';

export class OpencodeProvider implements AIProvider {
  name = 'opencode';

  async generateProblem(level: string): Promise<ProblemData> {
    const prompt = `Generate a math problem for a young child at level "${level}".
Return valid JSON only (no markdown, no extra text) with fields:
{
  "prompt": "string - the math question",
  "choices": ["string - option A", "string - option B", "string - option C", "string - option D"],
  "correctIndex": number (0-3),
  "level": "${level}"
}`;

    const output = execSync(`opencode prompt "${prompt}"`, {
      encoding: 'utf-8',
      timeout: 30000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const cleaned = output.trim().replace(/^```json\s*|```\s*$/g, '');
    const parsed = JSON.parse(cleaned);

    return {
      problemId: crypto.randomUUID(),
      prompt: parsed.prompt,
      choices: parsed.choices,
      correctIndex: parsed.correctIndex,
      level,
    };
  }
}
