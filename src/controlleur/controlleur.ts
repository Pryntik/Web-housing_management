import { Request, Response, NextFunction } from "express";
import { NewsModel } from '../mongoose_news';

export const home = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const news = await NewsModel.find();
        // Rendre la vue avec les annonces
        res.render('home', {pageName: 'Home', news: news});
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces :', error);
        res.render('error', {
            pageName: 'Error',
            errorContent: 'Erreur lors de la récupération des annonces'
        });
    }
};

export const error = async(req: Request, res: Response) => {
    res.render('error', {pageName: 'Error'});
}

export const addNews = async(req: Request, res: Response) => {
    res.render('news', {pageName: 'News'});
}

export const about = async(req: Request, res: Response) => {
    res.render('about', {pageName: 'About'});
}

export const login = async( req: Request, res: Response) => {
    res.render('login', {pageName: 'Login'});
}

export const signup = async( req: Request, res: Response) => {
    res.render('signup', {pageName: 'Signup'});
}

export const visuNewsPrivee = async (req: Request, res: Response) => {
    try {
        const news = await NewsModel.find();
    
        res.render('homePrivate', {pageName: 'Private Home', news: news});
    } catch (error) {
        console.error('Erreur lors de la récupération des annonces privées :', error);
        res.render('error', {
            pageName: 'Error',
            errorContent: 'Erreur lors de la récupération des annonces privées'
        });
    }
}

export const formConsultationQuestion = async (req: Request, res: Response) => {
    const { newsId } = req.params;
    const news = await NewsModel.findById(newsId);

    if (!news) {
        return res.render('error', {
            pageName: 'Error',
            errorContent: 'Annonce non trouvée'
        });
    }

    res.render('chat', {news, pageName: "Chat"});
}

export const formQuestion = async (req: Request, res: Response) => {
    const { newsId } = req.params;
    const news = await NewsModel.findById(newsId);

    if (!news) {
        return res.render('error', {
            pageName: 'Error',
            errorContent: 'Annonce non trouvée'
        });
    }

    res.render('question', {news, pageName: "Question"});
};

export const formReponse = async (req: Request, res: Response) => {
    const { newsId, questionId } = req.params;
    const news = await NewsModel.findById(newsId);
    if (!news) {
        return res.render('error', {
            pageName: 'Error',
            errorContent: 'Annonce non trouvée'
        });
    }

    const question = news.questions.id(questionId);
    if (!question) {
        return res.render('error', {
            pageName: 'Error',
            errorContent: 'Question non trouvée'
        });
    }

    res.render('reponse', {news, question, pageName: 'Réponse' });
};

export const formEdit = async (req: Request, res: Response) => {
    const { newsId } = req.params;
    const news = await NewsModel.findById(newsId);

    if (!news) {
        return res.render('error', {
            pageName: 'Error',
            errorContent: 'Annonce non trouvée'
        });
    }

    res.render('edit', {news, pageName: 'Modification Annonce'});
};