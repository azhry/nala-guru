import { AIProvider, ProblemData } from './provider';
import { OpencodeProvider } from './opencode';
import { OpenAIProvider } from './openai';
import { LocalProvider } from './local';

const openaiProvider = new OpenAIProvider();
const opencodeProvider = new OpencodeProvider();
const localProvider = new LocalProvider();

const providers: (AIProvider | LocalProvider)[] = [
  openaiProvider,
  opencodeProvider,
  localProvider,
];

export async function generateProblem(level: string, locale?: string): Promise<ProblemData> {
  const errors: Error[] = [];
  for (const provider of providers) {
    try {
      return await provider.generateProblem(level, locale);
    } catch (err) {
      errors.push(err as Error);
    }
  }
  throw new Error(`All AI providers failed: ${errors.map(e => e.message).join('; ')}`);
}

export { AIProvider, ProblemData } from './provider';
export { detectLocale } from './locales';
