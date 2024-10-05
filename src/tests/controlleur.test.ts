import request from 'supertest';
import express from 'express';
import { home, error, addNews, about, login, signup, visuNewsPrivee, formConsultationQuestion, formQuestion, formReponse, formEdit } from '../controlleur/controlleur';
import { NewsModel } from '../mongoose_news';

const app = express();
app.set('view engine', 'pug');
app.use(express.json());

app.get('/', home);
app.get('/error', error);
app.get('/news', addNews);
app.get('/about', about);
app.get('/login', login);
app.get('/signup', signup);
app.get('/private-news', visuNewsPrivee);
app.get('/consultation-question/:newsId', formConsultationQuestion);
app.get('/question/:newsId', formQuestion);
app.get('/reponse/:newsId/:questionId', formReponse);
app.get('/edit/:newsId', formEdit);

jest.mock('../mongoose_news');

describe('Tests du contrôleur générale', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait afficher la page d\'accueil avec les annonces', async () => {
        (NewsModel.find as jest.Mock).mockResolvedValue([{ title: 'Test News' }]);
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Accueil');
        expect(response.text).toContain('Test News');
    });

    it('devrait afficher la page d\'erreur', async () => {
        const response = await request(app).get('/error');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Erreur');
    });

    it('devrait afficher la page d\'ajout d\'annonce', async () => {
        const response = await request(app).get('/news');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Annonce');
    });

    it('devrait afficher la page à propos', async () => {
        const response = await request(app).get('/about');
        expect(response.status).toBe(200);
        expect(response.text).toContain('À propos');
    });

    it('devrait afficher la page de connexion', async () => {
        const response = await request(app).get('/login');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Connexion');
    });

    it('devrait afficher la page d\'inscription', async () => {
        const response = await request(app).get('/signup');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Inscription');
    });

    it('devrait afficher la page des annonces privées avec les annonces', async () => {
        (NewsModel.find as jest.Mock).mockResolvedValue([{ title: 'Private News' }]);
        const response = await request(app).get('/private-news');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Annonces Privées');
    });

    it('devrait afficher la page de consultation des questions avec l\'annonce', async () => {
        (NewsModel.find as jest.Mock).mockResolvedValue({ title: 'Test News' });
        const response = await request(app).get('/consultation-question/1');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Liste Question Réponses Annonce');
    });

    it('devrait afficher la page de question avec l\'annonce', async () => {
        (NewsModel.find as jest.Mock).mockResolvedValue({ title: 'Test News' });
        const response = await request(app).get('/question/1');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Question Annonce');
    });

    it('devrait afficher la page de réponse avec l\'annonce et la question', async () => {
        (NewsModel.find as jest.Mock).mockResolvedValue({
            title: 'Test News',
            questions: [{ _id: '1', text: 'Test Question' }]
        });
        const response = await request(app).get('/reponse/1/1');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Réponse Annonce');
    });

    it('devrait afficher la page de modification avec l\'annonce', async () => {
        (NewsModel.find as jest.Mock).mockResolvedValue({ title: 'Test News' });
        const response = await request(app).get('/edit/1');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Modification Annonce');
    });
});