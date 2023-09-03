import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export default (roles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return res.status(403).json({message: "Unauthorized"})
            }
            const {roles: userRoles} = jwt.verify(token, process.env.JWT_SECRET)
            let hasRole = false
            userRoles.forEach(role => {
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