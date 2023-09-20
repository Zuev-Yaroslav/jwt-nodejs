import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import RefreshToken from "../models/RefreshToken.js"
dotenv.config()

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, { expiresIn: "30m" })
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
    async removeRefreshToken(refreshToken) {
        return await RefreshToken.deleteOne({refreshToken})
    }
}
export default new TokenService();