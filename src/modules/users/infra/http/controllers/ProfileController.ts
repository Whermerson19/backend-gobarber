import { Request, Response } from 'express';
import { container } from 'tsyringe';
import User from '../../typeorm/entities/User';

import UpdateProfileService from '@modules/users/services/UpdateProfile/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfile/ShowProfileService';

const _user = new User();


export default class ProfileController {


    public async show(request: Request, response: Response): Promise<Response> {

        const user_id = _user.id;

        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({
            user_id
        });

        return response.json(user);

    }


    public async update(request: Request, response: Response): Promise<Response> {
        const user_id = _user.id;

        const { name, email, old_password, password } = request.body;

        const updateProfile = container.resolve(UpdateProfileService);

        const user = await updateProfile.execute({
            user_id,
            name,
            email,
            old_password,
            password
        });

        return response.json(user);

    }
}