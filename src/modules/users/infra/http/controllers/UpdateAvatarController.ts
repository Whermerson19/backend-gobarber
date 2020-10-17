import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateAvatarService from '@modules/users/services/UpdateAvatar/UpdateAvatarService';

import User from '@modules/users/infra/typeorm/entities/User';

export default class UpdateAvatarController {
    public async update(request: Request, response: Response): Promise<Response> {
        const updateAvatar = container.resolve(UpdateAvatarService);

        const userId = new User();
    
        const user = await updateAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        });
    
    
        return response.json(classToClass(user));       
    }
}