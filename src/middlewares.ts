import express, { Request, Response, NextFunction } from 'express';

const app = express();

// Middleware de journalisation
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} - ${req.url}`);
  next();
});

// Middleware pour gérer les erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.message);
  res.status(500).send('Erreur serveur');
});