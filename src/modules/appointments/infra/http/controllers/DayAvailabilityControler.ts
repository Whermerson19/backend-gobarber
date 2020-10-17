import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';


export default class DayAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        
        const { provider_id } = request.params;
        
        const { day, month, year } = request.body;

        const listProviderDayAvailability = container.resolve(ListProviderDayAvailabilityService);

        const providers = await listProviderDayAvailability.execute({
            user_id: provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year)
        });

        return response.json(providers);

    }
}