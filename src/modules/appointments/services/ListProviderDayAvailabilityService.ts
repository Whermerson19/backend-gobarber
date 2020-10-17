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

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
              provider_id: user_id,
              year,
              month,
              day,
            },
          );
      
          const hourStart = 8;
      
          const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
          );
      
          const currentDate = new Date(Date.now());
      
          const availability = eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(
              appointment => getHours(appointment.date) === hour,
            );
      
            const compareDate = new Date(year, month - 1, day, hour);
      
            return {
              hour,
              available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
          });
      
          return availability;
    }
}