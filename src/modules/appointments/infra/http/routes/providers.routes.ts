import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';


import ensureAuthenticate from '@shared/infra/http/middlewares/ensureAuthenticated';

import ProvidersController from '../controllers/ProvidersController';

import MonthAvailabilityControler from '../controllers/MonthAvailabilityControler';
import DayAvailabilityControler from '../controllers/DayAvailabilityControler';

const providersRouter = Router();

const providersController = new ProvidersController();
const monthAvailabilityControler = new MonthAvailabilityControler();
const dayAvailabilityControler = new DayAvailabilityControler();

providersRouter.use(ensureAuthenticate);

providersRouter.get('/', providersController.index);
providersRouter.get('/:provider_id/month-availability', celebrate({
    [Segments.PARAMS]: {
        provider_id: Joi.string().uuid().required()
    }
}), monthAvailabilityControler.index);
providersRouter.get('/:provider_id/day-availability', celebrate({
    [Segments.PARAMS]: {
        provider_id: Joi.string().uuid().required()
    }
}), dayAvailabilityControler.index);

export default providersRouter;