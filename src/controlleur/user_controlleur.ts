import passport from "passport";
import { Response, Request, NextFunction } from "express";
import { UserModel } from "../mongoose_user";

export const verifConnexion = async(req: Request, res: Response, next: NextFunction) => {
    try {
        var {login, password, role} = req.body;
        if(!login || !password) {
            return res.status(400).json({message: "Les informations ne sont pas bonnes"});
        }

        const verifUser = await UserModel.findOne({login: login});
        if(!verifUser) {
            return res.status(400).json({message: "Aucune Utilisateur existant"});
        }
        passport.authenticate('local', (err: Error | null, verifUser: typeof UserModel | false, info: any) => {
            if(err) {
                return next(err);
            }
            if (!verifUser) {
                return res.status(400).json({message: "Mot de passe ou identifiant invalide"});
            }

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
