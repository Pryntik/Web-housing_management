import passport from 'passport';
import express, { Request, Response } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Strategy as LocalStrategy } from 'passport-local';
import { SessionType } from './types/TSession';

/* Initialisation du serveur */
const app = express();
const sessions: SessionType = {};
const port = 1337;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req: Request, res: Response) => {
    app.locals.pageName = "Home";
    res.render('home');
});

app.get('/about', (req: Request, res: Response) => {
    app.locals.pageName = "About";
    res.render('about');
});

app.get('/login', (req: Request, res: Response) => {
    app.locals.pageName = "Login";
    res.render('login');
});

app.get('/erreur', (req: Request, res: Response) => {
    res.render('erreur');
});

app.post('/login/password', (req: Request, res: Response) => {
    const{username, password} = req.body;
    if (username !== 'admin' || password !== 'admin') {
        res.status(401).render('erreur');
    }
    const sessionId = uuidv4();
    sessions[sessionId] = {username, userId: 1};
    app.locals.pageName = "Home";
    res.render('home');
});

// Authentification avec Passport.js
passport.use(new LocalStrategy(
    (username, password, done) => {
      // Exemple de validation utilisateur
      if (username === 'admin' && password === 'secret') {
        return done(null, { id: 1, username: 'admin' });
      }
      else {
        return done(null, false, { message: 'Identifiants incorrects' });
      }
    }
));

// Exemple de requêtes HTTP avec Express
/*app.get('/advert/:id?', (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`Vous avez demandé l'annonce avec l'id : ${id}`);
})

.get('/search', (req: Request, res: Response) => {
    const query = req.query.q;
    console.log('Requête de recherche : ' + query);
    res.send('Résultats de la recherche');
});*/

  // Exemple de route qui utilise EJS pour rendre une vue
/*app.get('/user/:id', (req: Request, res: Response) => {
    const user = { id: req.params.id, name: 'Tom' };
    res.render('hello_user', { user });
  });*/

app.use(require('express-session')({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());