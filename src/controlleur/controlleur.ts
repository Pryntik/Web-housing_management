import { Request, Response, NextFunction } from "express";
import { app } from "..";
import { AnnonceModel } from '../mongoose_annonce';

export const accueil = async (req: Request, res: Response, next: NextFunction) => {
    app.locals.pageName = "Home";
    try {
        const annonces = await AnnonceModel.find({ statutPublication: 'publiee' });

        // Rendre la vue avec les annonces
        res.render('home', {
            pageName: 'Home',
            annonces: annonces // Passez les annonces à la vue
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
        res.status(500).send('Erreur interne du serveur.');
    }
};

export const about = async(req: Request, res: Response) => {
    app.locals.pageName = "About";
    res.render('about');
}

export const login = async( req: Request, res: Response) => {
    app.locals.pageName = "Login";
    res.render('login');
}

export const erreur = async(req: Request, res: Response) => {
    res.render('erreur');
}

export const creaAnnonce = async(req: Request, res: Response) => { 
    res.render('annonces');
}


