import { Request, Response } from "express";
import { app } from "..";

export const accueil = async (req: Request, res: Response) => {
    app.locals.pageName = "Home";
    res.render('home');
}

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




