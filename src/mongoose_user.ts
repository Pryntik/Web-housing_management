import mongoose, { Document, Model } from 'mongoose';

type roles = 'utilisateur' | 'agent' | 'admin';
// Interface définissant le schéma Animal pour ajouter de la sécurité de type
export interface IUser extends Document {
  login: string;
  password: string;
  role: roles;
}

// Création du schéma Animal
export const userSchema = new mongoose.Schema<IUser>({
  login: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['utilisateur', 'agent', 'admin'], required: true}

}, {timestamps: true});

// Création du modèle Animal
export const UserModel: Model<IUser> = mongoose.model<IUser>('user', userSchema);

// Création d'un nouvel objet
/*const user = new User({ id: 1, login: 'admin', password: 'admin', role: "admin" });
user.save();

(async () => {
  try {
    // Connexion à la base de données MongoDB
    await mongoose.connect('mongodb://localhost:27017/mydatabase', {
    });
    console.log('MongoDB Connected');

    // Création de plusieurs objets Animal
    const createUser = [
      new User({ id: 2, login: 'user1', password: 'password1', role: "admin" }),
      new User({ id: 3, login: "user2", password: 'password2', role: 'visiteur'}),
      new User({ id: 4, login: "user3", password: 'password3', role: 'visiteur'}),
    ];

    // Sauvegarde des animaux
    await Promise.all(
      createUser.map(async (user) => {
        try {
          await user.save();
        } catch (err) {
          console.error('Error saving User:', err);
        }
      })
    );

    // Recherche d'animaux dans la base de données
    let users = await User.find({ role: 'admin' })
      .where('id')
      .gt(1)
      .select({ login: 1, password: 1 }) // sélection des colonnes
      .lean(); // conversion en objets JavaScript simples
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  } finally {
    // Déconnexion de la base de données
    try {
      await mongoose.disconnect();
      console.log('MongoDB Disconnected');
    } catch (err) {
      console.error('Error disconnecting MongoDB:', err);
    }
  }
})();*/
