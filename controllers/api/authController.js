import Role from "../../models/Role.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import registerValidation from "../../validations/user/registerValidation.js";
import loginValidation from "../../validations/user/loginValidation.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { url } from "inspector";
import { randomInt } from "crypto";

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" })
}

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
            return res.json({ message: "User successfully registered." })
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Registration error" })
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
                    const token = generateAccessToken(user._id, user.roles)
                    return res.json({ token });
                }
            }
            return res.status(403).json({ message: "Username or password is incorrect" })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Login error" })
        }
    }
    async me(req, res) {
        var user = await User.findById(req.user.id, {password: 0})
        if (user) {
            user.image = `${req.protocol}://${req.get('host')}/${user.image}`
        }

        res.json(user)
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users)
        } catch (e) {
            console.log(e)
            res.json(e)
        }
    }
}
export default new authController()