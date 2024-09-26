import { Response, Request, NextFunction } from "express";
import { AnnonceModel, IAnnonceImmobiliere } from '../mongoose_annonce';
import { IUser } from "../mongoose_user";
import multer from 'multer';

// Création du multer pour gérer les fichiers (images)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const ajoutAnnonce = [
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
