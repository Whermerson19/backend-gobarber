import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../../../errors/AppError';

import authConfig from '@config/auth';

interface tokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function(request: Request, response: Response, next: NextFunction): void {

    // validation token jwt

    // get of header
    const authHeader = request.headers.authorization;

    if(!authHeader)
        throw new AppError('JWT Token is Missing!!!');
    
    // verify token

    const [, token] = authHeader.split(' ');

    try {
        const verifyToken = verify(token, authConfig.jwt.secret);
        const { sub } = verifyToken as tokenPayload;

        request.user = {
            id: sub,
        }

        return next();
    }catch {
        throw new AppError('Invalid token!!!');
    }

}