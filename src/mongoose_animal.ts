import mongoose, { Document, Model } from 'mongoose';

// Interface définissant le schéma Animal pour ajouter de la sécurité de type
interface IAnimal extends Document {
  name: string;
  type: string;
  age: number;
}

// Création du schéma Animal
const animalSchema = new mongoose.Schema<IAnimal>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number, default: 0 },
});

// Création du modèle Animal
const Animal: Model<IAnimal> = mongoose.model<IAnimal>('Animal', animalSchema);

// Création d'un nouvel objet
const dog = new Animal({ name: 'Paf', type: 'dog', age: 4 });
dog.save();

(async () => {
  try {
    // Connexion à la base de données MongoDB
    await mongoose.connect('mongodb://localhost:27017/test', {
    });
    console.log('MongoDB Connected');

    // Création de plusieurs objets Animal
    const createDogs = [
      new Animal({ name: 'Paf', type: 'dog', age: 4 }),
      new Animal({ name: 'Tobi', type: 'dog', age: 5 }),
      new Animal({ name: 'BebePaf', type: 'dog' }),
    ];

    // Sauvegarde des animaux
    await Promise.all(
      createDogs.map(async (animal) => {
        try {
          await animal.save();
        } catch (err) {
          console.error('Error saving animal:', err);
        }
      })
    );

    // Recherche d'animaux dans la base de données
    let dogs = await Animal.find({ type: 'dog' })
      .where('age')
      .gt(2)
      .lt(8) // contrainte sur l'âge
      .sort({ age: -1 }) // tri par âge décroissant
      .select({ name: 1, age: 1 }) // sélection des colonnes
      .lean(); // conversion en objets JavaScript simples

    // Mise à jour de l'âge des chiens
    const updatedDogs = await Promise.all(
      dogs.map(async (dog) => {
        dog.age++;
        try {
          const updatedDog = await Animal.findByIdAndUpdate(dog._id, { age: dog.age }, { new: true });
          return updatedDog;
        } catch (err) {
          console.error('Error updating dog:', err);
          return null;
        }
      })
    );

    console.log('Updated dogs:', updatedDogs.filter(Boolean)); // Filtrage des null

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
})();
