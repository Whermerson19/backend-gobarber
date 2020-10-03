import { inject, injectable } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';
 
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
    user_id: string;
    month: number;
    year: number;
}

type Response = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService{
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ user_id, month, year }: Request): Promise<Response> {

        const appointments = await this.appointmentsRepository.findAllInMonth({
            provider_id: user_id,
            month,
            year
        });

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (value, index) => index + 1
        );

        const availability = eachDayArray.map(day => {
            const appointmentsDay = appointments.filter(appointment => getDate(appointment.date) === day);

            return {
                day,
                available: appointmentsDay.length < 10,
            }
        })

        return availability;
    }
}