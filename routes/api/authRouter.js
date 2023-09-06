import { Router } from "express";
import authController from "../../controllers/api/authController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import roleMiddleware from "../../middlewares/roleMiddleware.js";
import refreshMiddleware from "../../middlewares/refreshMiddleware.js";

const authRouter = new Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/users',authMiddleware, roleMiddleware(['admin']), authController.getUsers);
authRouter.get('/me', authMiddleware, authController.me);
authRouter.get('/refresh', refreshMiddleware, authController.refresh);
 
export default authRouter;