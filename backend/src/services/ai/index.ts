import { AIProvider, ProblemData } from './provider';
import { OpencodeProvider } from './opencode';
import { OpenAIProvider } from './openai';

const providers: AIProvider[] = [
  new OpencodeProvider(),
  new OpenAIProvider(),
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
