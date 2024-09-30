import { Response, Request, NextFunction } from "express";
import { AnnonceModel, IAnnonceImmobiliere } from '../mongoose_annonce';
import { IUser, UserModel } from "../mongoose_user";
import multer from 'multer';

// Création du multer pour gérer les fichiers (images)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadNews = [
    upload.array('photos'), // Middleware pour gérer les images
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {
                titre,
                typeBien,
                statutPublication,
                statutBien,
                description,
                prix,
                dateDisponibilite,
            } = req.body;

            // Initialisation des images en vides
            let images: { data: Buffer; contentType: string }[] = [];

            // Si des images sont fournis, les transformer en tableau d'images
            if (req.files && Array.isArray(req.files)) {
                images = req.files.map((file: Express.Multer.File) => ({
                    data: file.buffer,
                    contentType: file.mimetype
                }));
            }

            // Créer une nouvelle instance d'annonce
            const nouvelleAnnonce: IAnnonceImmobiliere = new AnnonceModel({
                titre,
                typeBien,
                statutPublication,
                statutBien,
                description,
                prix,
                dateDisponibilite,
                photos: images.length > 0 ? images : undefined // Ternaire qui stocke les images que si elles existent
            });

            // Sauvegarde l'annonce dans la base de données
            const annonceSauvegardee = await nouvelleAnnonce.save();

            // Redirection à l'accueil si la création s'est effectuée
            //res.status(201).json(annonceSauvegardee); Vérification que l'annonce soit bien crée.
            res.redirect("/");
        } catch (error) {
            console.error('Erreur lors de la création de l\'annonce :', error);
            res.status(500).send('Erreur interne du serveur.');
        }
    }
];

export const askQuestion = async (req: Request, res: Response) => {
    const { annonceId } = req.params; 
    const { contenu } = req.body;

    const user = req.user as IUser;

    try {

        if (!contenu) {
            return res.status(400).json({ message: 'Question non valide.' });
        }

        // Cherche l'annonce dans la base de données pour l'update
        const annonce = await AnnonceModel.findById(annonceId);
        const reponses: { user: IUser; contenu: string; date: Date  }[] = [];
        if (!annonce) {
            return res.status(404).send('Annonce non trouvée');
        }

        annonce.questions.push({
            user,
            contenu,
            reponses,
            date: new Date()
        });

        await annonce.save();

        res.status(200).json(annonce);
    } catch (error) {
        console.error('Erreur lors de la création de la question:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const addResponse = async (req: Request, res: Response, next: NextFunction) => {
    const { annonceId, questionId } = req.params;
    const { reponse } = req.body;

    const userId = req.user as IUser;

    try {

        if (!reponse) {
            return res.status(400).json({ message: 'Reponse non valide.' });
        }

        // Chercher l'annonce correspondante
        const annonce = await AnnonceModel.findById(annonceId);
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce non trouvée.' });
        }

        // Chercher la question à laquelle on veut répondre
        const question = annonce.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question non trouvée.' });
        }

        // Ajouter la réponse à la question
        question.reponses.push({ user: userId, contenu: reponse, date: new Date() });

        // Sauvegarder l'annonce avec la nouvelle réponse
        await annonce.save();

        res.status(200).json({ message: 'Réponse ajoutée avec succès.' });
    } catch (error) {
        next(error);
    }
};