import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config()

export default (roles) => {
    return async (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "Unauthorized"})
            }
            const {id} = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(id);
            let hasRole = false
            user.roles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })
            if (!hasRole) {
                return res.status(403).json({message: "You don't have access"})
            }
            next();
        } catch(e) {
            console.log(e);
            return res.status(403).json({message: "Unauthorized"})
        }
    }
}