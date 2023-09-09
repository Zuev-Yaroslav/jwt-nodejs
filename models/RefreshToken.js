import { Schema, model } from "mongoose";

const RefreshToken = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    refreshToken: {type: String, required: true}
}, {timestamps: true, versionKey: false})

export default model('RefreshToken', RefreshToken)