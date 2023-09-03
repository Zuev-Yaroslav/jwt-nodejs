import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config()

const authMiddleware = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).json({message: "Unauthorized"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedData;
        const user = await User.findById(decodedData.id)
        if (!user) {
            return res.status(403).json({message: "Unauthorized"})
        }
        next();
    } catch(e) {
        console.log(e);
        return res.status(403).json({message: "Unauthorized", errors: e})
    }
}

export default authMiddleware;