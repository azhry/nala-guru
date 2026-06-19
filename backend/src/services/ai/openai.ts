import crypto from 'crypto';
import { AIProvider, ProblemData } from './provider';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export class OpenAIProvider implements AIProvider {
  name = 'openai';

  async generateProblem(level: string): Promise<ProblemData> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = `You generate math problems for young children (ages 2-5) at various levels.
Return valid JSON only with fields: prompt (string), choices (array of 4 strings), correctIndex (number 0-3).`;

    const userPrompt = `Generate a math problem at level "${level}".`;

    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    const cleaned = content.trim().replace(/^```json\s*|```\s*$/g, '');
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
