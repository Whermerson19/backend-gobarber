/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';


import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';

import cors from 'cors';

import 'express-async-errors';

import uploadConfig from '@config/upload';

import '@modules/users/providers';
import '@shared/container';

import AppError from '@shared/errors/AppError';

import routes from './routes';


// Importando a conexão do banco
import '@shared/infra/typeorm';

const app = express();

// Libera a aplicação para acessar a url do cors
app.use(
    cors({
        origin: 'http://localhost:3000',
    }),
);

app.use(express.json());

app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

// Será o middleware da tratativa de erros
app.use(
    (
        err: Error,
        _request: Request,
        response: Response,
        _next: NextFunction,
    ) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }

        console.log(err);

        return response.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    },
);

app.listen(3333, () => {
    console.log('🚀 Server running');
});