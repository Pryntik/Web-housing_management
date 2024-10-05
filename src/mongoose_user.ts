import mongoose, { Document, Model } from 'mongoose';
import { RoleType } from './types/TUser';

// Interface définissant le schéma User
export interface IUser extends Document {
  login: string;
  password: string;
  role: RoleType;
}

// Création du schéma User
export const userSchema = new mongoose.Schema<IUser>({
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['utilisateur', 'agent', 'admin'], required: true}

}, {timestamps: true});

// Création du modèle UserModel
export const UserModel: Model<IUser> = mongoose.model<IUser>('user', userSchema);
