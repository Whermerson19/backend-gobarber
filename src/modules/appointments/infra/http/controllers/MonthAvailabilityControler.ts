import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';


export default class MonthAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.params.provider_id;
        
        const { month, year } = request.body;

        const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);

        const providers = await listProviderMonthAvailability.execute({
            user_id: provider_id,
            month,
            year
        });

        return response.json(providers);

    }
}