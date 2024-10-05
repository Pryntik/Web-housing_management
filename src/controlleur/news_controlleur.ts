import { Response, Request, NextFunction } from "express";
import { NewsModel, INewsImmobiliere } from '../mongoose_news';
import { IUser, UserModel } from "../mongoose_user";
import multer from 'multer';
import { imageNewsDefault, ImageType } from "../types/TImage";

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
            let images: ImageType[] = [];

            // Si des images sont fournis, les transformer en tableau d'images
            if (req.files && Array.isArray(req.files)) {
                images = req.files.map((file: Express.Multer.File) => ({
                    data: file.buffer,
                    contentType: file.mimetype
                }));
            }

            // Créer une nouvelle instance d'annonce
            const newsObject: INewsImmobiliere = new NewsModel({
                titre,
                typeBien,
                statutPublication,
                statutBien,
                description,
                prix,
                dateDisponibilite,
                photos: images.length > 0 ? images : imageNewsDefault // Ternaire qui stocke les images que si elles existent
            });

            // Sauvegarde l'annonce dans la base de données
            await newsObject.save();

            // Redirection à l'accueil si la création s'est effectuée
            res.redirect("/");
        } catch (error) {
            console.error('Erreur lors de la création de l\'news :', error);
            res.status(500).send('Erreur interne du serveur.');
        }
    }
];

export const askQuestion = async (req: Request, res: Response) => {
    const { newsId } = req.params; 
    const { contenu } = req.body;

    const user = req.user as IUser;

    try {

        if (!contenu) {
            return res.status(400).json({ message: 'Question non valide.' });
        }

        // Cherche l'annonce dans la base de données pour l'update
        const news = await NewsModel.findById(newsId);
        const reponses: { user: IUser; contenu: string; date: Date  }[] = [];
        if (!news) {
            return res.status(404).send('Annonce non trouvée');
        }

        news.questions.push({
            user,
            contenu,
            reponses,
            date: new Date()
        });

        await news.save();

        res.status(200).json(news);
    } catch (error) {
        console.error('Erreur lors de la création de la question:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const addResponse = async (req: Request, res: Response, next: NextFunction) => {
    const { newsId, questionId } = req.params;
    const { reponse } = req.body;

    const userId = req.user as IUser;

    try {

        if (!reponse) {
            return res.status(400).json({ message: 'Reponse non valide.' });
        }

        // Chercher l'annonce correspondante
        const news = await NewsModel.findById(newsId);
        if (!news) {
            return res.status(404).json({ message: 'Annonce non trouvée.' });
        }

        // Chercher la question à laquelle on veut répondre
        const question = news.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question non trouvée.' });
        }

        // Ajouter la réponse à la question
        question.reponses.push({ user: userId, contenu: reponse, date: new Date() });

        // Sauvegarder l'annonce avec la nouvelle réponse
        await news.save();

        res.status(200).json({ message: 'Réponse ajoutée avec succès.' });
    } catch (error) {
        next(error);
    }
};

export const editNews = [
    upload.array('photos'), // Middleware pour gérer les images
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { newsId } = req.params;
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

            const updatedNews = await NewsModel.findByIdAndUpdate(
                newsId,
                { 
                    titre,
                    typeBien,
                    statutPublication,
                    statutBien,
                    description,
                    prix,
                    dateDisponibilite,
                    photos: images.length > 0 ? images : undefined // Ternaire qui stocke les images que si elles existent
                },
            );

            if (!updatedNews) {
                return res.status(404).send('Annonce non trouvée');
            }

            // Redirection à l'accueil si la modification s'est effectuée
            res.redirect("/");
        } catch (error) {
            res.status(500).send('Erreur interne du serveur.');
        }
    }
];

export const publierNews = async (req: Request, res: Response) => {
    const { id } = req.params; // Récupérer l'ID de l'annonce à publier
    console.log("ID de l'annonce :", req.params.id);
    try {
        // Mettre à jour l'annonce avec le statut "publiée"
        const annonce = await NewsModel.findByIdAndUpdate(id, { statutPublication: 'publiee' });
        if (!annonce) {
            return res.status(404).send('Annonce non trouvée');
        }

        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la publication de l\'annonce :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};

export const deleteNews = [
    upload.array('photos'), // Middleware pour gérer les images
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { newsId } = req.params;
            await NewsModel.deleteOne({ _id: newsId });

            // Redirection à l'accueil si la modification s'est effectuée
            res.redirect("/");
        } catch (error) {
            res.status(500).send(error);
        }
    }
];