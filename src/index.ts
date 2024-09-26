import passport from 'passport';
import session from 'express-session';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import multer from 'multer';
import { about, accueil, erreur, login, creaAnnonce } from './controlleur/controlleur';
import { verifConnexion } from './controlleur/user_controlleur';
import { ensureAuthenticated, verifRole } from './passport-config';
import { UserModel } from './mongoose_user';
import { ajoutAnnonce } from './controlleur/annonce_controlleur';

/* Initialisation du serveur */
export const app = express();
const port = 3000;

// Configure multer pour gérer les fichiers
const storage = multer.memoryStorage(); // Utiliser memoryStorage pour garder les fichiers en mémoire
const upload = multer({ storage: storage });

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase', {
    }).then(() => {
        console.log('Connexion à MongoDB réussie');
    }).catch((error) => {
        console.error('Erreur de connexion à MongoDB :', error);
});

// Configuration de la session
app.use(session({
  secret: 'secret', // Change cela pour un secret plus sûr
  resave: false,
  saveUninitialized: true,
}));

// Initialiser Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', accueil);
app.get('/about', about);
app.get('/login', login);
app.get('/erreur', erreur);
app.post('/login/check', verifConnexion);
app.get('/creerAnnonce', ensureAuthenticated, verifRole('agent'), creaAnnonce); 
app.post('/creerAnnonce/ajoutAnnonce', ensureAuthenticated , ajoutAnnonce); //checkRole, modifierAnnonce); // A FAIRE

// Création des Utilisateurs (Utilisation de Postman pour crée les user directement sans utiliser de route crée)
//app.post('/createUser', createUser);
/*async function createUser() {
  const newUser = new UserModel({
      login: 'user2',
      password: 'password2',
      role: 'admin' // ou 'agent', 'admin'
  });

  try {
      const savedUser = await newUser.save();
      console.log('Utilisateur créé avec succès :', savedUser);
  } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
  }
}*/