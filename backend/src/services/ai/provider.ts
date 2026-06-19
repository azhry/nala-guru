export interface ProblemData {
  problemId: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  level: string;
}

export interface AIProvider {
  generateProblem(level: string): Promise<ProblemData>;
  name: string;
}
