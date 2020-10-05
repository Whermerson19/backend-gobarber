import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
 
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    user_id: string;
    day: number;
    month: number;
    year: number;
}

type Response = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService{
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ user_id, day, month, year }: Request): Promise<Response> {

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({ 
            provider_id: user_id, 
            day, 
            month, 
            year
        });

        const startHour = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (value, index) => index + startHour 
        );

        const availability = eachHourArray.map(hour => {

            const checkedAppointmentInHour = appointments.find(appointment => getHours(appointment.date) === hour);

            const currentDate = new Date(Date.now());
            const appointmentDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !checkedAppointmentInHour && isAfter(appointmentDate, currentDate),
            }
        })

       return availability;
    }
}