import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

interface Request {
    except_user_id: string;
}

@injectable()
export default class ListProviderService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) {}

    public async execute({ except_user_id }: Request): Promise<User[]> {

        let users = await this.cacheProvider.recover<User[]>(`providers-list:${except_user_id}`)

        if (!users) {
            users = await this.usersRepository.findAllProviders(
              except_user_id,
            );
      
            await this.cacheProvider.save(
              `providers-list:${except_user_id}`,
              classToClass(users),
            );
          }


        return users

    }

}