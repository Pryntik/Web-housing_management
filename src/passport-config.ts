import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel, IUser } from './mongoose_user';
import { Request, Response, NextFunction } from 'express';

// Configurer la stratégie locale
passport.use(new LocalStrategy(
  { usernameField: 'login', passwordField: 'password' }, // champs utilisés dans le formulaire
  async (login: string, password: string, done) => {
    try {
      const utilisateur = await UserModel.findOne({ login });
      
      // Vérifier si l'utilisateur existe
      if (!utilisateur) {
        return done(null, false, { message: 'Utilisateur non trouvé.' });
      }

      // Vérifier si le mot de passe correspond
      if (utilisateur.password !== password) {
        return done(null, false, { message: 'Mot de passe incorrect.' });
      }

      // Authentification réussie
      return done(null, utilisateur);
    } catch (error) {
      return done(error);
    }
  }
));

// Sérialiser l'utilisateur dans la session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Désérialiser l'utilisateur de la session
passport.deserializeUser(async (id, done) => {
  try {
    const utilisateur = await UserModel.findById(id);
    done(null, utilisateur);
  } catch (error) {
    done(error);
  }
});

export const ensureAuthenticated = (req: any, res: any, next: any) => {
    if(!req.isAuthenticated()){
        res.redirect('/login');
    }
}


