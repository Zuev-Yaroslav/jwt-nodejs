import { Schema, model } from "mongoose";

const Otp = new Schema({
    email: {type: String, unique: true, required: true},
    otp: {type: String, required: true}
}, {timestamps: true, versionKey: false})

export default model('Otp', Otp)