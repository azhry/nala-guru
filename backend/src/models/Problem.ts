import mongoose, { Schema, Document } from 'mongoose';

export interface IProblem extends Document {
  problemId: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  level: string;
  createdAt: Date;
}

const ProblemSchema = new Schema<IProblem>({
  problemId: { type: String, required: true, unique: true },
  prompt: { type: String, required: true },
  choices: { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  level: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

ProblemSchema.index({ problemId: 1 });
ProblemSchema.index({ level: 1 });

export const Problem = mongoose.model<IProblem>('Problem', ProblemSchema);
