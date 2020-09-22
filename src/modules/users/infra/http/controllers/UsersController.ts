import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

interface userData {
    name: string;
    email: string;
    password?: string;
}


export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;

        const createUser = container.resolve(CreateUserService);
    
        const user: userData = await createUser.execute({
            name,
            email,
            password
        });
    
        delete user.password;
    
        return response.json(user);
    }
}