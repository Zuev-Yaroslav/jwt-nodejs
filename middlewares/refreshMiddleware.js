import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
dotenv.config()

export default async (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const {refreshToken} = req.body
        if (!refreshToken) {
            return res.status(403).json({message: "Unauthorized"})
        }
        const token = await RefreshToken.findOne({refreshToken})

        if (!token) {
            return res.status(403).json({message: "Unauthorized"})
        }
        const decodedData = jwt.verify(refreshToken, process.env.JWT_REFRESH)
        const user = await User.findById(decodedData.id)
        

        if (!user) {
            return res.status(403).json({message: "Unauthorized"})
        }
        req.user = user
        await RefreshToken.deleteOne({refreshToken})
        next();
    } catch(e) {
        console.log(e);
        return res.status(403).json({message: "Unauthorized", errors: e})
    }
}