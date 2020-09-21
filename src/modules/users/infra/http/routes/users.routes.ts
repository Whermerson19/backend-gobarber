import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UpdateAvatarController from '../controllers/UpdateAvatarController';

const userRouter = Router();
const updateAvatarController = new UpdateAvatarController();
const usersController = new UsersController();

userRouter.post('/', usersController.create);

userRouter.patch('/avatar', ensureAuthenticated, updateAvatarController.update);

export default userRouter;