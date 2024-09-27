import passport from "passport";
import { app } from "..";
import { Response, Request, NextFunction } from "express";
import { UserModel } from "../mongoose_user";

export const verifConnexion = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupération des informations du User
        var {login, password, role} = req.body;
        if(!login || !password) {
            return res.status(400).json({message: "Les informations ne sont pas bonnes"});
        }

        // Interrogation de la base de données
        const verifUser = await UserModel.findOne({login: login});
        if(!verifUser) {
            console.log("Aucun Utilisateur existant");
            app.locals.errorContent = "Aucun Utilisateur existant";
            return res.redirect('/error');
        }

        // Utilisation de la méthode authenticate de passportJS 
        passport.authenticate('local', (err: Error | null, verifUser: typeof UserModel | false, info: any) => {
            if(err) {
                return next(err);
            }
            if (!verifUser) {
                console.log("Identifiant ou Mot de pas Incorrect");
                app.locals.errorContent = "Identifiant ou Mot de pas Incorrect";
                return res.redirect('/error');
            }

            // Si le User est bien dans la base de données on le connecte ce qui met le cookie dans le navigateur et permet de faire les autres actions
            req.logIn(verifUser, (err) => {
                if(err) {
                    return next(err)
                }
                return res.redirect('/');
            });
        })(req, res, next);
    } catch(err) {
        res.status(400).json({error: err});
    };
}
