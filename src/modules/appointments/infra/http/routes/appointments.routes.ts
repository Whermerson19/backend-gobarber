import { Router } from 'express';

import AppointmentsController from '../controllers/AppointmentsController';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const appointmentRouter = Router();

const appointmentController = new AppointmentsController();

appointmentRouter.use(ensureAuthenticated);


// appointmentRouter.get('/', async(request, response) => {

//     const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//     const allAppointments = await appointmentsRepository.find();

//     return response.json(allAppointments);
// }) 

appointmentRouter.post('/', appointmentController.create);

export default appointmentRouter;