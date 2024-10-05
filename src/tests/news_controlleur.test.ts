import request from 'supertest';
import express from 'express';
import { uploadNews, askQuestion, addResponse, editNews, publierNews, deleteNews } from '../controlleur/news_controlleur';
import { NewsModel } from '../mongoose_news';
import { UserModel } from '../mongoose_user';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock routes for testing
app.post('/uploadNews', uploadNews);
app.post('/askQuestion/:newsId', askQuestion);
app.post('/addResponse/:newsId/:questionId', addResponse);
app.put('/editNews/:newsId', editNews);
app.post('/publierNews/:id', publierNews);
app.delete('/deleteNews/:newsId', deleteNews);

describe('Tests des annonces', () => {
    let newsId: string;
    let questionId: string;
    let userId: string;

    beforeAll(async () => {
        // Créer un utilisateur fictif
        const user: any = new UserModel({ username: 'testuser', password: 'password' });
        await user.save();
        userId = user._id.toString();

        // Créer une annonce fictive
        const news: any = new NewsModel({
            titre: 'Test News',
            typeBien: 'Appartement',
            statutPublication: 'brouillon',
            statutBien: 'disponible',
            description: 'Test description',
            prix: 100000,
            dateDisponibilite: new Date(),
            photos: []
        });
        await news.save();
        newsId = news._id.toString();
    });

    afterAll(async () => {
        await UserModel.deleteMany({});
        await NewsModel.deleteMany({});
    });

    it('devrait télécharger une annonce', async () => {
        const response = await request(app)
            .post('/uploadNews')
            .field('titre', 'New Test News')
            .field('typeBien', 'Maison')
            .field('statutPublication', 'brouillon')
            .field('statutBien', 'disponible')
            .field('description', 'New test description')
            .field('prix', 200000)
            .field('dateDisponibilite', new Date().toISOString());

        expect(response.status).toBe(302); // Statut de redirection
    });

    it('devrait poser une question', async () => {
        const response = await request(app)
            .post(`/askQuestion/${newsId}`)
            .send({ contenu: 'Est-ce toujours disponible ?' })
            .set('user', userId);

        expect(response.status).toBe(200);
        expect(response.body.questions[0].contenu).toBe('Est-ce toujours disponible ?');
        questionId = response.body.questions[0]._id;
    });

    it('devrait ajouter une réponse à une question', async () => {
        const response = await request(app)
            .post(`/addResponse/${newsId}/${questionId}`)
            .send({ reponse: 'Oui, c\'est toujours disponible.' })
            .set('user', userId);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Réponse ajoutée avec succès.');
    });

    it('devrait modifier une annonce', async () => {
        const response = await request(app)
            .put(`/editNews/${newsId}`)
            .field('titre', 'Updated Test News')
            .field('typeBien', 'Appartement')
            .field('statutPublication', 'brouillon')
            .field('statutBien', 'disponible')
            .field('description', 'Updated test description')
            .field('prix', 150000)
            .field('dateDisponibilite', new Date().toISOString());

        expect(response.status).toBe(302); // Statut de redirection
    });

    it('devrait publier une annonce', async () => {
        const response = await request(app)
            .post(`/publierNews/${newsId}`);

        expect(response.status).toBe(302); // Statut de redirection
    });

    it('devrait supprimer une annonce', async () => {
        const response = await request(app)
            .delete(`/deleteNews/${newsId}`);

        expect(response.status).toBe(302); // Statut de redirection
    });
});