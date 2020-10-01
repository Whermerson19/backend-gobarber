import { inject, injectable } from 'tsyringe';
import { differenceInHours } from 'date-fns'

import IUsersRepository from '../../repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '../../repositories/IUserTokenRepository';
import IHashProvider from '../../providers/hashProvider/models/IHashProvider';

interface Request {
    token: string;
    password: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ token, password }: Request): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if(!userToken)
            throw new AppError('User token does not exists');

        const user = await this.usersRepository.findById(userToken.user_id);

        if(!user){
            console.log('caiu aqui');
            throw new AppError('User does not exists');
        }
            
        const tokenCreatedAt = userToken.created_at;
        const differenceTime = differenceInHours(Date.now(), tokenCreatedAt)

        if(differenceTime > 2)
            throw new AppError('Token expired');

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}