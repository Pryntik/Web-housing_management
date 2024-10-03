import { app, logStatus } from "..";
import { Request, Response, NextFunction } from "express";
import { AnnonceModel } from '../mongoose_annonce';

export const home = async (req: Request, res: Response, next: NextFunction) => {
    app.locals.pageName = "Home";
    try {
        const news = await AnnonceModel.find({ statutPublication: 'publiee' });

        // Rendre la vue avec les annonces
        res.render('home', {
            pageName: 'Home',
            logStatus: logStatus,
            news: news // Passez les annonces à la vue
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
        res.status(500).send('Erreur interne du serveur.');
    }
};

export const error = async(req: Request, res: Response) => {
    res.render('error', {pageName: 'Error', logStatus: logStatus,});
}

export const addNews = async(req: Request, res: Response) => {
    res.render('news', {pageName: 'News', logStatus: logStatus,});
}

export const about = async(req: Request, res: Response) => {
    res.render('about', {pageName: 'About', logStatus: logStatus,});
}

export const login = async( req: Request, res: Response) => {
    res.render('login', {pageName: 'Login', logStatus: logStatus,});
}

export const signup = async( req: Request, res: Response) => {
    res.render('signup', {pageName: 'Signup', logStatus: logStatus,});
}

export const formQuestion = async (req: Request, res: Response) => {
    const { annonceId } = req.params;
    const annonce = await AnnonceModel.findById(annonceId);

    if (!annonce) {
        return res.status(404).send('Annonce not found');
    }

    res.render('question', { annonce, pageName: "Question Annonce" });
};

export const formReponse = async (req: Request, res: Response) => {
    const { annonceId, questionId } = req.params;
    const annonce = await AnnonceModel.findById(annonceId);
    if (!annonce) {
        return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    const question = annonce.questions.id(questionId);
    if (!question) {
        return res.status(404).json({ message: 'Question non trouvée.' });
    }

    res.render('reponse', { annonce, question, pageName: 'Réponse Annonce' });
};

export const formModif = async (req: Request, res: Response) => {
    const { annonceId } = req.params;
    const annonce = await AnnonceModel.findById(annonceId);

    if (!annonce) {
        return res.status(404).send('Annonce not found');
    }

    res.render('modif', { annonce, pageName: 'Modification Annonce'});
};