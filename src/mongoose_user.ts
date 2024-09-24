import mongoose, { Document, Model } from 'mongoose';

type RoleType = 'utilisateur' | 'agent' | 'admin';
// Interface définissant le schéma Animal pour ajouter de la sécurité de type
export interface IUser extends Document {
  login: string;
  password: string;
  role: RoleType;
}

// Création du schéma Animal
export const userSchema = new mongoose.Schema<IUser>({
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['utilisateur', 'agent', 'admin'], required: true}

}, {timestamps: true});

// Création du modèle Animal
export const UserModel: Model<IUser> = mongoose.model<IUser>('user', userSchema);
