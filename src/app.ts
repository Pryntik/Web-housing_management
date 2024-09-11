import passport from 'passport';
import express, { Request, Response } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';

/* Initialisation du serveur */
const app = express();
const port = 1337;

app.get('*', (req: Request, res: Response) => {
  res.send('<h1>Hello, World!</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

app.set('view engine', 'ejs');
app.set('views', './views');

/* Routes */

// Exemple de requêtes HTTP avec Express
app.get('/advert/:id?', (req: Request, res: Response) => {
    const id = req.params.id;
    res.send(`Vous avez demandé l'annonce avec l'id : ${id}`);
})
.get('/search', (req: Request, res: Response) => {
    const query = req.query.q;
    console.log('Requête de recherche : ' + query);
    res.send('Résultats de la recherche');
});

// Exemple de route qui utilise EJS pour rendre une vue
app.get('/user/:id', (req: Request, res: Response) => {
  const user = { id: req.params.id, name: 'Tom' };
  res.render('hello_user', { user });
});

// Utilisation de MongoDB avec Express
app.post('/api/projects', auth.ensureAuthenticated, createProject);

function createProject(req, res) {
  var project = new Project(req.body);
  project.creator = req.user;
  project.save(function(err) {
    if (err) {
      res.status(500).json(err);
    }
    else {
      if (!req.user.hasProjects) {
        User.update({_id: req.user._id}, {hasProjects: true}, function(err) {
          if (err) {
            res.status(500).json(err);
          }
        });
      }
      res.json(project);
    }
  });
};

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

app.use(require('express-session')({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
