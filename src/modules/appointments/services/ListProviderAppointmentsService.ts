import { inject, injectable } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointments from '../infra/typeorm/entities/Appointment';

interface Request {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
export default class ListProviderAppointmentsService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}


    public async execute({ provider_id, day, month, year }: Request): Promise<Appointments[]> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            day,
            month,
            year
        });

        return appointments;
    }
}