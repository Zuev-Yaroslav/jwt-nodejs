import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import RefreshToken from "../models/RefreshToken.js"
dotenv.config()

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, { expiresIn: "1h" })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: "1d" })
        return {accessToken, refreshToken}
    }
    async saveRefreshToken(userId, refreshToken) {
        const tokenData = await RefreshToken.findOne({userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await RefreshToken.create({userId, refreshToken})
        return token
    }
}
export default new TokenService();