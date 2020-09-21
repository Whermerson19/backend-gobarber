import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateAvatarService from '@modules/users/services/UpdateAvatarService';

import User from '@modules/users/infra/typeorm/entities/User';

export default class UpdateAvatarController {
    public async update(request: Request, response: Response): Promise<Response> {
        const updateAvatar = container.resolve(UpdateAvatarService);

        const userId = new User();
    
        const user = await updateAvatar.execute({
            user_id: userId.id,
            avatarFileName: request.file.filename
        });
    
    
        return response.json(user);       
    }
}