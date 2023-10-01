import { Router } from "express";
import authController from "../../controllers/api/authController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import roleMiddleware from "../../middlewares/roleMiddleware.js";
import verifyMiddleware from "../../middlewares/verifyMiddleware.js";

const authRouter = new Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/resend-verify', authMiddleware, authController.resendVerify);
authRouter.post('/verify', authMiddleware, authController.emailVerify);
authRouter.get('/users', authMiddleware, verifyMiddleware, roleMiddleware(['admin']), authController.getUsers);
authRouter.patch('/users/update', authMiddleware, authController.update);
authRouter.get('/me', authMiddleware, authController.me);
authRouter.get('/refresh', authController.refresh);
authRouter.get('/logout', authController.logout);
 
export default authRouter;