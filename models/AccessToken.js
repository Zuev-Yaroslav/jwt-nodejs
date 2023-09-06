import { Schema, model } from "mongoose";

const AccessToken = new Schema({
    accessToken: {type: String}
}, {timestamps: true, versionKey: false})

export default model('AccessToken', AccessToken)