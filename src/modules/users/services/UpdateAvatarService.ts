import { inject, injectable } from 'tsyringe';

import fs from 'fs';
import path from 'path';

import AppError from '@shared/errors/AppError';

import User from '../infra/typeorm/entities/User';
import UploadConfig from '@config/upload';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
    user_id: string;
    avatarFileName: string;
}

@injectable()
export default class UpdateAvatarService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ){}

    public async execute({ user_id, avatarFileName }: Request): Promise<User> {

        const user = await this.usersRepository.findById(user_id);

        if(!user){
            console.log(user);
            console.log(user_id)
            throw new AppError('Only authenticated users can change avatar!!!');
        }

        if(user.avatar) {
            // to delete avatar
            const userAvatarFilePath = path.join(UploadConfig.directory, user.avatar);
            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists)
                await fs.promises.unlink(userAvatarFilePath);
        }

        user.avatar = avatarFileName;

        // update avatar with method save()
        await this.usersRepository.save(user);

        return user;
    }
}