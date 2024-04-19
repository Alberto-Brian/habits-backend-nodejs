import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type Express = (req: Request, res: Response, next: any) => void;

export default (req:Request, res: Response, next: any) => {
    try {
        const token:  string = req.headers.authorization?.split(' ')[1] ?? ''; //dividir a string em 2 elementos e pegar o segundo (o 1º é o Bearer, o 2º é o token)
        const decode = jwt.verify(token, 'secret');
        req.body.user = decode;
        next();
    } catch (error) {
        return res.status(500).send({error: 'Falha na autenticação'});
    }
} 

export const opcional: Express = (req, res, next) => {
    try {
        const token: string = req.headers.authorization?.split(' ')[1] ?? ''; //dividir a string em 2 elementos e pegar o segundo (o 1º é o Bearer, o 2º é o token)
        const decode = jwt.verify(token, process.env.JWT_KEY ?? '');
        // req.usuario = decode;
        next();
    } catch (error) {
        next() //Mesmo sem token vai para o próximo middleware
    }
}
