import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/api/authRouter.js";
import bodyParser from 'body-parser';
import formData from 'express-form-data';
import fileUpload from "express-fileupload";
import os from 'os';
import postRouter from "./routes/api/postRouter.js";
import methodOverride from "method-override";
import fs from "fs";
dotenv.config();


const PORT = process.env.PORT;
const app = express();

if (!fs.existsSync('public/storage/users')) {
    fs.mkdirSync("public/storage/users")
}
if (!fs.existsSync("public/storage/users/images")) {
    fs.mkdirSync("public/storage/users/images")
}

if (!fs.existsSync('public/storage/posts')) {
    fs.mkdirSync("public/storage/posts")
}
if (!fs.existsSync("public/storage/posts/images")) {
    fs.mkdirSync("public/storage/posts/images")
}

app.use(fileUpload({
    parseNested: true
}))

app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use((req, res, next) => {
    if (req.files) {
        Object.keys(req.files).forEach(key => {
            if (Array.isArray(req.files[key])) {
                req.files[key] = req.files[key].filter(el => el !== null)
            }
        });

    }
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (Array.isArray(req.body[key])) {
                req.body[key] = req.body[key].filter(el => el !== null)
            }
        });
    }

    next()
})
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT, () => console.log(`PORT: ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
