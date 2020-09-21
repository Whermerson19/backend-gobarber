import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';


import User from '../infra/typeorm/entities/User';
import authConfig from '@config/auth';
import IUsersRepository from '../repositories/IUsersRepository';


interface RequestDTO {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
export default class CreateSessionsService {
    
    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository
    ) {}

    public async execute({ email, password }: RequestDTO): Promise<Response> {

        
        // check if email exists
        const user = await this.userRepository.findByEmail(email);

        if(!user){
            throw new AppError('Invalid email/password!!!!', 401);
        }

        // compare encrypted password
        // user.password --> encrypted password
        // password --> unencryptes password

        const comparePassword = await compare(password, user.password);

        if(!comparePassword){
            throw new AppError('Invalid email/password!!!!', 401);
        }

        // params of method sign

        // 1 -> payload => information not secured
        // 2 -> key => key on format of string
        // 3 -> configurations 

        const token = sign( {}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: '1d',
        } );

        return {
            user,
            token
        };
    }
}