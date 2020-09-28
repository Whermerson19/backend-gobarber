import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '../../repositories/IUserTokenRepository';

interface Request {
    email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokenRepository,
    ) {}

    public async execute({ email }: Request): Promise<void> {

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if(!checkUserExists)
            throw new AppError('User does not exists');

        await this.userTokenRepository.generate(checkUserExists.id);

        await this.mailProvider.sendMail(email, 'email de recuperação de senha')
    }
}