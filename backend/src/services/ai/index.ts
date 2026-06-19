import { AIProvider, ProblemData } from './provider';
import { OpencodeProvider } from './opencode';
import { OpenAIProvider } from './openai';
import { LocalProvider } from './local';

const providers: (AIProvider | LocalProvider)[] = [
  new OpenAIProvider(),
  new OpencodeProvider(),
  new LocalProvider(),
];

export async function generateProblem(level: string): Promise<ProblemData> {
  const errors: Error[] = [];
  for (const provider of providers) {
    try {
      return await provider.generateProblem(level);
    } catch (err) {
      errors.push(err as Error);
    }
  }
  throw new Error(`All AI providers failed: ${errors.map(e => e.message).join('; ')}`);
}

export { AIProvider, ProblemData } from './provider';
