import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UpdateAvatarController from '../controllers/UpdateAvatarController';

const userRouter = Router();
const upload = multer(uploadConfig);
const updateAvatarController = new UpdateAvatarController();
const usersController = new UsersController();

userRouter.post('/', celebrate({
    [Segments.BODY]: {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }
}), usersController.create);

userRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), updateAvatarController.update);

export default userRouter;