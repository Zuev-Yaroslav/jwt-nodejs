import { Schema, model } from "mongoose";

const RefreshToken = new Schema({
    refreshToken: {type: String}
}, {timestamps: true, versionKey: false})

export default model('RefreshToken', RefreshToken)