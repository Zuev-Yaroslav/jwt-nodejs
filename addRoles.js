import Role from "./models/Role.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT, () => console.log(`PORT: ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
Role.insertMany([
    {value: "user"},
    {value: "admin"}
])
    .then(res => console.log("done"))
    .catch(err => console.log(err))