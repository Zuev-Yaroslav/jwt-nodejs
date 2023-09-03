import { isValidObjectId } from "mongoose";


export default (req, res, next) => {
    const {id} = req.params;
    if(!isValidObjectId(id)) {
        return res.status(200).send("Invalid params");
    }
    next()
}