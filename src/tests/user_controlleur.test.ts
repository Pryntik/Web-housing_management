import 'jest';
import passport from 'passport';
import request from 'supertest';
import { app } from '..';
import { UserModel } from '../mongoose_user';
import { verifConnexion, createUser, logout } from '../controlleur/user_controlleur';
import { NextFunction } from 'express';

jest.mock('../mongoose_user');
jest.mock('passport');

describe('Tests des utilisateurs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('verifConnexion', () => {
        it('devrait retourner 400 si le login ou le mot de passe est manquant', async () => {
            const res = await request(app)
                .post('/verifConnexion')
                .send({ login: '', password: '' });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Les informations ne sont pas bonnes");
        });

        it('devrait rediriger vers /error si l\'utilisateur n\'existe pas', async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post('/verifConnexion')
                .send({ login: 'test', password: 'test' });

            expect(res.status).toBe(302);
            expect(res.header.location).toBe('/error');
            expect(app.locals.errorContent).toBe("Aucun Utilisateur existant");
        });

        it('devrait rediriger vers /error si l\'authentification échoue', async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue({ login: 'test' });
            (passport.authenticate as jest.Mock).mockImplementation((strategy, callback) => {
                return (req: Request, res: Response, next: NextFunction) => {
                    callback(null, false, { message: 'Invalid credentials' });
                };
            });

            const res = await request(app)
                .post('/verifConnexion')
                .send({ login: 'test', password: 'test' });

            expect(res.status).toBe(302);
            expect(res.header.location).toBe('/error');
            expect(app.locals.errorContent).toBe("Identifiant ou Mot de passe Incorrect");
        });

        it('devrait rediriger vers / si l\'authentification réussit', async () => {
            (UserModel.findOne as jest.Mock).mockResolvedValue({ login: 'test' });
            (passport.authenticate as jest.Mock).mockImplementation((strategy, callback) => {
                return (req: Request, res: Response, next: NextFunction) => {
                    callback(null, { login: 'test' }, null);
                };
            });

            const res = await request(app)
                .post('/verifConnexion')
                .send({ login: 'test', password: 'test' });

            expect(res.status).toBe(302);
            expect(res.header.location).toBe('/');
            expect(app.locals.logStatus).toBe(true);
        });
    });

    describe('createUser', () => {
        it('devrait créer un nouvel utilisateur et rediriger vers /', async () => {
            const newUser = { login: 'test', password: 'test', role: 'user' };
            (UserModel.prototype.save as jest.Mock).mockResolvedValue(newUser);

            const res = await request(app)
                .post('/createUser')
                .send(newUser);

            expect(res.status).toBe(302);
            expect(res.header.location).toBe('/');
            expect(console.log).toHaveBeenCalledWith('Utilisateur créé avec succès :', newUser);
        });

        it('devrait rediriger vers /error s\'il y a une erreur lors de la création de l\'utilisateur', async () => {
            (UserModel.prototype.save as jest.Mock).mockRejectedValue(new Error('Error'));

            const res = await request(app)
                .post('/createUser')
                .send({ login: 'test', password: 'test', role: 'user' });

            expect(res.status).toBe(302);
            expect(res.header.location).toBe('/error');
            expect(console.error).toHaveBeenCalledWith('Erreur lors de la création de l\'utilisateur :', expect.any(Error));
        });
    });

    describe('logout', () => {
        it('devrait déconnecter l\'utilisateur et rediriger vers /', async () => {
            const req = { logout: jest.fn(), session: { destroy: jest.fn() } };
            const res = { redirect: jest.fn() };
            const next = jest.fn();

            req.logout.mockImplementation((callback) => callback(null));
            req.session.destroy.mockImplementation((callback) => callback(null));

            await logout(req as any, res as any, next);

            expect(req.logout).toHaveBeenCalled();
            expect(req.session.destroy).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('/');
            expect(app.locals.logStatus).toBe(false);
        });

        it('devrait appeler next avec une erreur si la déconnexion échoue', async () => {
            const req = { logout: jest.fn(), session: { destroy: jest.fn() } };
            const res = { redirect: jest.fn() };
            const next = jest.fn();

            const error = new Error('Erreur de déconnexion');
            req.logout.mockImplementation((callback) => callback(error));

            await logout(req as any, res as any, next);

            expect(next).toHaveBeenCalledWith(error);
        });

        it('devrait appeler next avec une erreur si la destruction de la session échoue', async () => {
            const req = { logout: jest.fn(), session: { destroy: jest.fn() } };
            const res = { redirect: jest.fn() };
            const next = jest.fn();

            const error = new Error('Erreur de destruction de session');
            req.logout.mockImplementation((callback) => callback(null));
            req.session.destroy.mockImplementation((callback) => callback(error));

            await logout(req as any, res as any, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });
});