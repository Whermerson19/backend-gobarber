import { inject, injectable } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';
 
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

        const appointments = await this.appointmentsRepository.findAllInMonth(
            {
              provider_id: user_id,
              year,
              month,
            },
          );
      
          const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
      
          const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
          );
      
          const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      
            const appointmentsInDay = appointments.filter(appointment => {
              return getDate(appointment.date) === day;
            });
      
            return {
              day,
              available:
                isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
            };
          });
      
          return availability;
    }
}