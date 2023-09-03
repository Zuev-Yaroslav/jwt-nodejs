import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import roleMiddleware from "../../middlewares/roleMiddleware.js";
import postController from "../../controllers/api/postController.js";
import objectIdMiddleware from "../../middlewares/objectIdMiddleware.js";
import checkUserPostMIddleware from "../../middlewares/checkUserPostMIddleware.js";

const postRouter = new Router();

postRouter.get('/', postController.index)
postRouter.post('/', authMiddleware, postController.store)
postRouter.patch('/:id', objectIdMiddleware, authMiddleware, checkUserPostMIddleware, postController.update)
postRouter.delete('/:id', objectIdMiddleware, authMiddleware, checkUserPostMIddleware, postController.delete)
postRouter.get('/:id', objectIdMiddleware, postController.show)
 
export default postRouter;