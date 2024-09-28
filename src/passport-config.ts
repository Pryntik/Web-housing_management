import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { IUser, RoleType, UserModel} from './mongoose_user';
import { Response, Request, NextFunction } from 'express';

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
passport.deserializeUser(async (id: string, done) => {
  try {
    const utilisateur = await UserModel.findById(id);
    done(null, utilisateur);
  } catch (error) {
    done(error);
  }
});

// Vérification que l'utilisateur est connecté (Utiliser comme Middleware pour être sûr que l'utilisateur est en premier lieu connecté)
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if(!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        next();
    }
}

// Vérification que l'utilisateur est connecté et qu'il possède le bon rôle (Utiliser comme Middleware pour être sûr que l'utilisateur peut accéder à certaines fonctionnalitées)
export const verifRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as IUser;
      if (req.isAuthenticated() && (user.role.includes(role) || user.role.includes('admin'))) {
          return next();
      } else {
          res.status(403).send('Accès interdit : rôle insuffisant');
      }
  };
};


