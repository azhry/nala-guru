import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  problemId: string;
  correct: boolean;
  level: string;
  answerIndex: number;
  correctIndex: number;
  timestamp: Date;
}

const SessionSchema = new Schema<ISession>({
  problemId: { type: String, required: true },
  correct: { type: Boolean, required: true },
  level: { type: String, required: true },
  answerIndex: { type: Number, required: true },
  correctIndex: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

SessionSchema.index({ level: 1, timestamp: -1 });
SessionSchema.index({ timestamp: -1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
