import passport from "passport";
import { app } from "..";
import { Response, Request, NextFunction } from "express";
import { UserModel } from "../mongoose_user";

export const verifConnexion = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // Récupération des informations du User
        var {login, password} = req.body;
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
                app.locals.logStatus = true;
                return res.redirect('/');
            });
        })(req, res, next);
    } catch(err) {
        res.status(400).json({error: err});
    };
}

// Création des Utilisateurs (Utilisation de Postman pour crée les user directement sans utiliser de route crée)
export const createUser = async(req: Request, res: Response, next: NextFunction) => {
    var {login, password, role} = req.body;

    const newUser = new UserModel({
        login: login,
        password: password,
        role: role,
    });

    try {
        const savedUser = await newUser.save();
        console.log('Utilisateur créé avec succès :', savedUser);
        return res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        return res.redirect('/error');
    }
}
