import {Router} from 'express';
import { getNewAccessToken } from '../controllers/token.controller.js';
import { login, register } from '../controllers/auth.controller.js';

const authRouter = Router();


authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", getNewAccessToken)





export default authRouter;
