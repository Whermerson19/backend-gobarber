import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderService from '../../../services/ListProviderService';

export default class ProvidersController {
    public async index(request: Request, response: Response): Promise<Response> {

        const listProvider = container.resolve(ListProviderService);

        const providers = await listProvider.execute({
            except_user_id: request.user.id,
        });
        
        return response.json(providers);

    }
}