import express, {Request, Response} from 'express';    // const express = require('express')
const app = express();
import morgan from 'morgan';    // const morgan = require('morgan');

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(morgan('dev'));

app.use('./uploads', express.static('uploads'));

app.use((req: Request, res:Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'GET, PUT, POST, PATCH, DELETE');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 
        'Origin, Content-Type, X-Requested-With, Accept, Authorization');
    }
    next();
})

//Rotas
import userRoutes from './routes/userRoutes';
import habitRoutes from './routes/habitRoutes';
import categoryRoutes from './routes/categoryRoutes';
import HCRoutes from './routes/HCRoutes';
app.use('/users', userRoutes);
app.use('/habits', habitRoutes);
app.use('/categories', categoryRoutes);
app.use('/hc', HCRoutes);


//Rota não encontrada
app.use((req: Request, res: Response, next) => {
    const error = new Error('Rota não encontrada');
    // error.status = 404;
    next(error);
})
app.use((error:any , req: Request, res: Response) => res.status(error.status || 500).send({error: error.message}));

// module.exports = app;
export default app;