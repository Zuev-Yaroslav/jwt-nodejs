import Role from "../../models/Role.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import registerValidation from "../../validations/user/registerValidation.js";
import loginValidation from "../../validations/user/loginValidation.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { randomInt } from "crypto";
import userResource from "../../apiResources/userResource.js";
import RefreshToken from "../../models/RefreshToken.js";
import tokenService from "../../services/tokenService.js";
import Otp from "../../models/Otp.js";
import mailService from "../../services/mailService.js";
import resendVerifyValidation from "../../validations/user/resendVerifyValidation.js";

class authController {
    constructor() {
        dotenv.config()
    }
    async register(req, res) {
        try {
            const { username, email, password, password_confirm } = req.body
            const image = (req.files && req.files.image) ? req.files.image : null

            const validErrors = registerValidation({ username, email, password, password_confirm, image })

            if (Object.keys(validErrors).length !== 0) {
                return res.status(400).json({ errors: validErrors })
            }

            const usernameExists = await User.findOne({ username })
            if (usernameExists) {
                return res.status(400).json({ message: 'User with the same name already exists' })
            }
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return res.status(400).json({ message: 'User with the same email already exists' })
            }

            const imagePath = `storage/users/images/${Date.now()}${randomInt(1000)}${path.extname(image.name)}`
            await image.mv('public/' + imagePath)
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'user' })
            const user = new User({ username, email, password: hashPassword, roles: [userRole.value], image: imagePath })
            await user.save()

            const tokens = tokenService.generateTokens({ id: user._id })
            await tokenService.saveRefreshToken(user._id, tokens.refreshToken)


            return res.json({ ...tokens })
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Registration error", errors: e })
        }
    }
    async update(req, res) {
        try {
            
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Update user error", errors: e })
        }
    }
    async resendVerify(req, res) {
        try {
            const { email } = req.user;
            // const validErrors = resendVerifyValidation({email})
            // if (Object.keys(validErrors).length !== 0) {
            //     return res.status(400).json({ errors: validErrors })
            // }
            const otpCode = Math.floor(Math.random() * 900000) + 100000;
            const otp = await Otp.findOneAndUpdate({ email: email }, { email: email, otp: otpCode })
            if (!otp) {
                const newOtp = new Otp({ email, otp: otpCode })
                await newOtp.save()
            }
            await mailService.sendActivation(email, otpCode)
            return res.json([])
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Resend verify error", errors: e })
        }
    }
    async emailVerify(req, res) {
        try {
            const { otpCode } = req.body;
            const { email } = req.user;
            const otp = await Otp.findOne({ email, otp: otpCode })
            if (!otp) {
                return res.status(400).json({ message: "Otp is incorrect" })
            }
            const now = new Date()
            const createdAt = new Date(otp.updatedAt)

            if (now.getTime() > createdAt.getTime() + 60 * 1000 * 5) {
                return res.status(400).json({ message: "Otp is expired" })
            }
            await User.findOneAndUpdate({ email }, { emailVerifiedAt: new Date() })
            return res.json({ message: "Email is verified" })

        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Email verification error", errors: e })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;

            const validErrors = loginValidation({ username, password })
            if (Object.keys(validErrors).length !== 0) {
                return res.status(400).json({ errors: validErrors })
            }

            const user = await User.findOne({ $or: [{ username: username }, { email: username }] })
            if (user) {
                const validPassword = bcrypt.compareSync(password, user.password)
                if (validPassword) {
                    const tokens = tokenService.generateTokens({ id: user._id })
                    await tokenService.saveRefreshToken(user._id, tokens.refreshToken)
                    return res.json({ ...tokens })
                }
            }
            return res.status(403).json({ message: "Username or password is incorrect" })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Login error" })
        }
    }
    async refresh(req, res) {
        try {
            const refreshToken = (req.headers.authorization) ? req.headers.authorization.split(' ')[1] : null
            if (!refreshToken) {
                return res.status(403).json({ message: "Unauthorized", errors: {message: "The token is not found"} })
            }
            const token = await RefreshToken.findOne({ refreshToken })

            if (!token) {
                return res.status(403).json({ message: "Unauthorized", errors: {message: "The token is expired"} })
            }
            const decodedData = jwt.verify(refreshToken, process.env.JWT_REFRESH)
            const user = await User.findById(decodedData.id)


            if (!user) {
                return res.status(403).json({ message: "Unauthorized", errors: {message: "The user is not found"} })
            }
            const tokens = tokenService.generateTokens({ id: user._id })
            await tokenService.saveRefreshToken(user._id, tokens.refreshToken)

            return res.json({ ...tokens })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Refresh error", errors: e })
        }
    }
    async logout(req, res) {
        try {
            const refreshToken = (req.headers.authorization) ? req.headers.authorization.split(' ')[1] : null
            if (!refreshToken) {
                return res.status(403).json({ message: "Unauthorized" })
            }
            jwt.verify(refreshToken, process.env.JWT_REFRESH)
            tokenService.removeRefreshToken(refreshToken)
            return res.json([])
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Logout error", errors: e })
        }
    }
    async me(req, res) {
        var user = await User.findById(req.user.id, { password: 0 })
        // if (user) {
        //     user.image = `${req.protocol}://${req.get('host')}/${user.image}`
        // }

        res.json(userResource.make(user))
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(userResource.collection(users))
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }
}
export default new authController()