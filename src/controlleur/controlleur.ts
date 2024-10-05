import { app, logStatus } from "..";
import { Request, Response, NextFunction } from "express";
import { NewsModel } from '../mongoose_news';

export const home = async (req: Request, res: Response, next: NextFunction) => {
    app.locals.pageName = "Home";
    try {
        const news = await NewsModel.find({ statutPublication: 'publiee' });

        // Rendre la vue avec les annonces
        res.render('home', {
            pageName: 'Home',
            logStatus: logStatus,
            news: news // Passez les annonces à la vue
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des newss :', error);
        res.status(500).send('Erreur interne du serveur.');
    }
};

export const error = async(req: Request, res: Response) => {
    res.render('error', {pageName: 'Error', logStatus: logStatus});
}

export const addNews = async(req: Request, res: Response) => {
    res.render('news', {pageName: 'News', logStatus: logStatus});
}

export const about = async(req: Request, res: Response) => {
    res.render('about', {pageName: 'About', logStatus: logStatus});
}

export const login = async( req: Request, res: Response) => {
    res.render('login', {pageName: 'Login', logStatus: logStatus});
}

export const signup = async( req: Request, res: Response) => {
    res.render('signup', {pageName: 'Signup', logStatus: logStatus});
}

export const formQuestion = async (req: Request, res: Response) => {
    const { newsId } = req.params;
    const news = await NewsModel.findById(newsId);

    if (!news) {
        return res.status(404).send('News non trouvé');
    }

    res.render('question', { news, pageName: "Question Annonce" });
};

export const formReponse = async (req: Request, res: Response) => {
    const { newsId, questionId } = req.params;
    const news = await NewsModel.findById(newsId);
    if (!news) {
        return res.status(404).json({ message: 'Annonce non trouvée.' });
    }

    const question = news.questions.id(questionId);
    if (!question) {
        return res.status(404).json({ message: 'Question non trouvée.' });
    }

    res.render('reponse', { news, question, pageName: 'Réponse Annonce' });
};

export const formModif = async (req: Request, res: Response) => {
    const { newsId } = req.params;
    const news = await NewsModel.findById(newsId);

    if (!news) {
        return res.status(404).send('News non trouvé');
    }

    res.render('edit', { news, pageName: 'Modification Annonce'});
};