import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateSessionsService from '@modules/users/services/CreateSession/CreateSessionsService';


export default class UsersController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const createSessions = container.resolve(CreateSessionsService);
    
        const { user, token } = await createSessions.execute({
            email,
            password,
        });
    
        // delete user.password; 
    
        return response.json({ user, token });
    }
}