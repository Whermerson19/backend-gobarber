import { Router } from 'express';

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
providersRouter.get('/:provider_id/month-availability', monthAvailabilityControler.index);
providersRouter.get('/:provider_id/day-availability', dayAvailabilityControler.index);

export default providersRouter;