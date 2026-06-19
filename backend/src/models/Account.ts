import mongoose, { Schema, Document } from 'mongoose';

export interface IAccount extends Document {
  babyName: string;
  babyBirthDate: string;
  createdAt: Date;
}

const AccountSchema = new Schema<IAccount>({
  babyName: { type: String, required: true },
  babyBirthDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Account = mongoose.model<IAccount>('Account', AccountSchema);
