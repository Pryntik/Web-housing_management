import mongoose, { Document, Model, Types } from 'mongoose';
import { IUser } from './mongoose_user';
import { TypeBien, StatutPublication, StatutBien } from './types/TNews';

export interface IImage {
    data: Buffer;
    contentType: string;
}

// Interface pour une question posée par un utilisateur
export interface IQuestion {
    user: IUser;
    contenu: string;
    reponses: IReponse[];
    date: Date;
}

const QuestionSchema = new mongoose.Schema<IQuestion>({
    user: {
        login: { type: String, required: true },
        roles: { type: [String] }
    },
    contenu: { type: String, required: true },
    reponses: [
        {
            user: {
                login: { type: String, required: true },
                roles: { type: [String], required: true }
            },
            contenu: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    date: { type: Date, default: Date.now }
});

export const QuestionModel = mongoose.model<IQuestion>('Question', QuestionSchema)
// Interface pour une réponse fournie par un agent immobilier
export interface IReponse {
    user: IUser;
    contenu: string;
    date: Date;
}

// Interface pour une annonce immobilière
export interface INewsImmobiliere extends Document {
    titre: string;
    typeBien: TypeBien;
    statutPublication: StatutPublication;
    statutBien: StatutBien;
    description: string;
    prix: number; // Peut être le prix de vente ou le loyer
    dateDisponibilite: Date;
    photos?: IImage[]; // Tableau d'URLs des photos, optionnel
    questions: Types.DocumentArray<IQuestion & Document>; // Liste des questions posées par les utilisateurs
    reponses: IReponse[]; // Liste des réponses fournies par les agents
}

// Schéma pour une News
export const NewsSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    typeBien: { type: String, enum: ['vente', 'location'], required: true },
    statutPublication: { type: String, enum: ['public', 'prive'], required: true },
    statutBien: { type: String, enum: ['disponible', 'loue', 'vendu'], required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    dateDisponibilite: { type: Date, required: true },
    photos: [{
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    }],
    questions: [ QuestionSchema ]
});

export const NewsModel = mongoose.model<INewsImmobiliere>('News', NewsSchema);
