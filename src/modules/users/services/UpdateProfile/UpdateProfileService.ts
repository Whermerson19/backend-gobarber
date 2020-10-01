import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '../../providers/hashProvider/models/IHashProvider';
import IUserRepository from '../../repositories/IUsersRepository';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ user_id, email, name, password, old_password }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if(!user)
            throw new AppError('User does not exists');

        const userWithEmailUpdated = await this.usersRepository.findByEmail(email);

        if(userWithEmailUpdated && userWithEmailUpdated.id !== user_id)
            throw new AppError('Email already in use');
        
        user.name = name;
        user.email = email;

        if(password && !old_password)
            throw new AppError('Inform the old_password');

        if(password && old_password){
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password
            );

            if(!checkOldPassword)
                throw new AppError('invalid old password')

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}
export default UpdateProfileService;