import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/test';

mongoose.connect(uri, {})
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));
  