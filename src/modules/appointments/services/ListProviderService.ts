import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface Request {
    except_user_id: string;
}

@injectable()
export default class ListProviderService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ except_user_id }: Request): Promise<User[]> {
        const users = await this.usersRepository.findAllProviders(except_user_id);

        if(!users)
            throw new AppError('users not found');

        return users

    }

}