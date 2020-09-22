import 'reflect-metadata';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import 'express-async-errors';
import routes from './routes';

import '../typeorm';
import '@shared/container';

import AppError from '../../errors/AppError';

const app = express();
app.use(cors())
app.use(express.json())
app.use(routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    // checar se o erro é causado pela aplicação
    if(err instanceof AppError)
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    
    // se for erro fora da aplicação 
    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
})


app.listen(3333, () => {
    console.log("<== <== SERVER <-> STARTED ==> ==>")
});