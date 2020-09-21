import { startOfHour } from "date-fns";
import { getCustomRepository } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from "../infra/typeorm/entities/Appointment";

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import AppointmentRepository from '../infra/typeorm/repositories/AppointmentsRespository'; 

interface RequestDTO {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService { 
    // exclusive service to create appointment <==> must have only one method;

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({ provider_id, date }: RequestDTO): Promise<Appointment> {
        
        const appointmentsRepository = getCustomRepository(AppointmentRepository);
        const appointmentDate = startOfHour(date);

        const findAppintmentSameDate = await this.appointmentsRepository.findByDate(appointmentDate);

        if(findAppintmentSameDate)
            throw new AppError('This appointment is already booked!!!');

        const appointment = await appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        });

        return appointment;
    }
}

export default CreateAppointmentService;