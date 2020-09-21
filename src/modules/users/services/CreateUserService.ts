import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ){}

    public async execute({ name, email, password }: RequestDTO): Promise<User> {

        // check if email already in use
        const checkedEmail = await this.usersRepository.findByEmail(email);

        if(checkedEmail)
            throw new AppError('Email address is already in use!!!', 401);

        // create a criptPassword
        const hashedPassoword = await hash(password, 8);

        // if elmail not exits, to create new user,
        const user = this.usersRepository.create({
            name,
            email,
            password: hashedPassoword
        });

        return user;
    }
}

export default CreateUserService;