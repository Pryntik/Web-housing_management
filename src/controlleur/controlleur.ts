import { app, logStatus } from "..";
import { Request, Response, NextFunction } from "express";
import { AnnonceModel } from '../mongoose_annonce';

export const home = async (req: Request, res: Response, next: NextFunction) => {
    app.locals.pageName = "Home";
    try {
        const annonces = await AnnonceModel.find({ statutPublication: 'publiee' });

        // Rendre la vue avec les annonces
        res.render('home', {
            pageName: 'Home',
            logStatus: logStatus,
            annonces: annonces // Passez les annonces à la vue
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
        res.status(500).send('Erreur interne du serveur.');
    }
};

export const about = async(req: Request, res: Response) => {
    res.render('about', {pageName: 'About', logStatus: logStatus,});
}

export const login = async( req: Request, res: Response) => {
    res.render('login', {pageName: 'Login', logStatus: logStatus,});
}

export const error = async(req: Request, res: Response) => {
    res.render('error', {pageName: 'Error', logStatus: logStatus,});
}

export const creaAnnonce = async(req: Request, res: Response) => {
    res.render('annonces', {pageName: 'News', logStatus: logStatus,});
}
