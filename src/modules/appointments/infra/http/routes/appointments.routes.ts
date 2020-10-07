import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const appointmentRouter = Router();

const appointmentController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentRouter.use(ensureAuthenticated);

appointmentRouter.post('/', celebrate({
    [Segments.BODY]: {
        provider_id: Joi.string().uuid().required(),
        date: Joi.date()
    }
}), appointmentController.create);
appointmentRouter.get('/me', providerAppointmentsController.index);

export default appointmentRouter;