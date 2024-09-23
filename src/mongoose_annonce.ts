import mongoose, { Document, Model } from 'mongoose';
import { IUser } from './mongoose_user';
// Type pour le statut de publication et le statut du bien
type StatutPublication = 'publiee' | 'non publiee';
type StatutBien = 'disponible' | 'loue' | 'vendu';
type TypeBien = 'vente' | 'location';

export interface IImage {
    data: Buffer;
    contentType: String;
}

// Interface pour une question posée par un utilisateur
export interface IQuestion {
    id: number;
    user: IUser;
    contenu: string;
    reponses: IReponse[];
    date: Date;
}

// Interface pour une réponse fournie par un agent immobilier
export interface IReponse {
    id: number;
    user: IUser;
    contenu: string;
    date: Date;
}

// Interface pour une annonce immobilière
export interface IAnnonceImmobiliere {
    id: string;
    titre: string;
    typeBien: TypeBien;
    statutPublication: StatutPublication;
    statutBien: StatutBien;
    description: string;
    prix: number; // Peut être le prix de vente ou le loyer
    dateDisponibilite: Date;
    photos?: IImage[]; // Tableau d'URLs des photos, optionnel
    questions: IQuestion[]; // Liste des questions posées par les utilisateurs
    reponses: IReponse[]; // Liste des réponses fournies par les agents
}

// Schéma pour une Annonce
export const AnnonceSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    typeBien: { type: String, enum: ['vente', 'location'], required: true },
    statutPublication: { type: String, enum: ['publiee', 'non publiee'], required: true },
    statutBien: { type: String, enum: ['disponible', 'loue', 'vendu'], required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    dateDisponibilite: { type: Date, required: true },
    photos: { 
                data: { type: Buffer, required: true},
                contentType: { type: String, required: true}
    },
    questions: [
        {
            user: {
                login: { type:String, required: true },
                roles: { type: [String],}
            },
            content: { type: String, required: true},
            reponses:
                [{ 
                    user: {
                        login: { type:String, required: true },
                        roles: { type: [String], required: true}
                    },
                    content: { String, required: true},
                    date: { type: Date, default: Date.now}
                }],
            date: { type: Date, default: Date.now}
        }
    ],
});

export const Annonce = mongoose.model<IAnnonceImmobiliere & Document>('Annonce', AnnonceSchema);