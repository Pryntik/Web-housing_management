import passport from 'passport'
import session from 'express-session';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import multer from 'multer';
import { home, error, addNews, about, login, signup, formQuestion, formReponse, formEdit, formConsultationQuestion, visuNewsPrivee } from './controlleur/controlleur';
import { createUser, logout, verifConnexion } from './controlleur/user_controlleur';
import { ensureAuthenticated, verifRole } from './passport-config';
import { addResponse, askQuestion, deleteNews, editNews, publierNews, uploadNews } from './controlleur/news_controlleur';

/* Initialisation du serveur */
export const app = express();
app.locals.logStatus = false;
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
    secret: 'secret',
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

// Page
app.get('/', home);
app.get('/error', error);
app.get('/addnews', ensureAuthenticated, verifRole('agent'), addNews); 
app.get('/about', about);
app.get('/logout', logout);
app.get('/login', login);
app.get('/signup', signup);
app.get('/newsPrivees', ensureAuthenticated, verifRole('agent'), visuNewsPrivee);
app.get('/news/:newsId', ensureAuthenticated, formConsultationQuestion);
app.get('/news/:newsId/questions', ensureAuthenticated, verifRole('utilisateur'), formQuestion);
app.get('/news/:newsId/editNews', ensureAuthenticated, verifRole('agent'), formEdit);
app.get('/news/:newsId/deleteNews', ensureAuthenticated, verifRole('agent'), deleteNews);
app.get('/news/:newsId/questions/:questionId', ensureAuthenticated, verifRole('agent'), formReponse);

// Post
app.post('/addnews/uploadnews', ensureAuthenticated , uploadNews); //checkRole, editNews); // A FAIRE
app.post('/login/check', verifConnexion);
app.post('/signup/createUser', createUser);
app.post('/news/:newsId/ask-question', askQuestion);
app.post('/news/:newsId/questions/:questionId/repondre', addResponse);
app.post('/news/:newsId/editNews/validerModif', editNews);
app.post('/newsPrivee/:newsId/publier', publierNews);
