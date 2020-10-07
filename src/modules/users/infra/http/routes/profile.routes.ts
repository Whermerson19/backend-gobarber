import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';


import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/', profileController.update);
profileRouter.get('/', celebrate({
    [Segments.BODY]: {
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
        password_confirmation: Joi.string(),
        old_password: Joi.string().valid(Joi.ref('password')),
    }
}), profileController.show);


export default profileRouter;