import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import roleMiddleware from "../../middlewares/roleMiddleware.js";
import postController from "../../controllers/api/postController.js";
import objectIdMiddleware from "../../middlewares/objectIdMiddleware.js";
import checkUserPostMIddleware from "../../middlewares/checkUserPostMIddleware.js";
import verifyMiddleware from "../../middlewares/verifyMiddleware.js";
import mailService from "../../services/mailService.js";

const postRouter = new Router();

postRouter.get('/', postController.index)
postRouter.post('/', authMiddleware, verifyMiddleware, postController.store)
postRouter.patch('/:id', objectIdMiddleware, authMiddleware, verifyMiddleware, checkUserPostMIddleware, postController.update)
postRouter.delete('/:id', objectIdMiddleware, authMiddleware, verifyMiddleware, checkUserPostMIddleware, postController.delete)
postRouter.get('/:id', objectIdMiddleware, postController.show)
// postRouter.post('/send', (req, res) => {
//     try {
//         const {email, message} = req.body;
//         if (email && message) {
//             mailService.sendMail(email, message);
//         }
//         return res.json("send");
//     } catch(e) {
//         return res.status(400).json("error")
//     }
// })
 
export default postRouter;