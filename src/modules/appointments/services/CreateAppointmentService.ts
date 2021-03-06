import { format, getHours, isBefore, startOfHour } from "date-fns";
import { getCustomRepository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from "../infra/typeorm/entities/Appointment";

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

import AppointmentRepository from '../infra/typeorm/repositories/AppointmentsRespository'; 

interface RequestDTO {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService { 
    // exclusive service to create appointment <==> must have only one method;

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository
    ) {}

    public async execute({ provider_id, user_id, date }: RequestDTO): Promise<Appointment> {
        
        const appointmentDate = startOfHour(date);

        const findAppintmentSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id
        );

        if(user_id === provider_id)
            throw new AppError('You can not to create an appointment with yourself');

        if(isBefore(appointmentDate, Date.now()))
            throw new AppError("Error to create a new appointment, because this date already past");

        if(findAppintmentSameDate)
            throw new AppError('This appointment is already booked!!!');

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17)
            throw new AppError('You can not to create an appointment before 8am and after 5pm')

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate 
        });

        const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para o dia ${formattedDate}`,
        })

        return appointment;
    }
}

export default CreateAppointmentService;