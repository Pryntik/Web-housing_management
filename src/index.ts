import './passport-config';
import passport from 'passport';
import session from 'express-session';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import { about, accueil, erreur, login } from './controlleur/controlleur';
import { verifConnexion } from './controlleur/user_controlleur';
import { ensureAuthenticated } from './passport-config';

/* Initialisation du serveur */
export const app = express();
const port = 3000;

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
app.get('/annonceModif', ensureAuthenticated) //modifAnnonce); // A FAIRE

//Crée Utilisateur
/*async function createUser() {
  const newUser = new UserModel({
      login: 'user3',
      password: 'password3',
      role: 'utilisateur' // ou 'agent', 'admin'
  });

  try {
      const savedUser = await newUser.save();
      console.log('Utilisateur créé avec succès :', savedUser);
  } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
  }
}*/
// Crée Utilisateur
/*app.post('/createUser', (req: Request, res: Response) => {
  createUser();
  res.render('erreur');
});*/
/*app.post('/login/check', async (req: Request, res: Response) => {
  const { login, password } = req.body;

  try {
      console.log("Login reçu du formulaire : ", login);

      // Rechercher l'utilisateur dans la base de données (insensible à la casse)
      const utilisateur = await UserModel.find().where({ 'login': login   });

      console.log("Utilisateur trouvé : ", utilisateur);

      // Vérifier si l'utilisateur existe
      /*if (!utilisateur) {
          return res.status(401).render('erreur', { message: 'Utilisateur non trouvé.' });
      }

      // Vérifier si le mot de passe correspond
      if (utilisateur.password !== password) {
          return res.status(401).render('erreur', { message: 'Mot de passe incorrect.' });
      }

      // Si les identifiants sont valides, générer une session
      const sessionId = uuidv4();
      sessions[sessionId] = { login: utilisateur.login, id: String(utilisateur._id) };

      // Rediriger vers la page d'accueil
      res.render('home');
  } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      res.status(500).send('Erreur interne du serveur.');
  }
});*/