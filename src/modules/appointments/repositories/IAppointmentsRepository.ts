// esta interface, vai definir os metodos que vão ser utilizados no meu repositorio de appointments.

import Appointment from "../entities/Appointment";
import ICreateAppointmentsDTO from '../dtos/ICreateAppointmentsDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentsDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
}