import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config()

const authMiddleware = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const accessToken = (req.headers.authorization) ? req.headers.authorization.split(' ')[1] : null
        if (!accessToken) {
            return res.status(403).json({message: "Unauthorized", errors: {message: "The token is not found"}})
        }
        const decodedData = jwt.verify(accessToken, process.env.JWT_ACCESS)
        const user = await User.findById(decodedData.id, {password: 0})
        if (!user) {
            return res.status(403).json({message: "Unauthorized", errors: {message: "The user is not found"}})
        }
        req.user = user
        next();
    } catch(e) {
        console.log(e);
        return res.status(403).json({message: "Unauthorized", errors: e})
    }
}

export default authMiddleware;