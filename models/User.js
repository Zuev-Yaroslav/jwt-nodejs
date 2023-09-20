import { Schema, model } from "mongoose";

const User = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}],
    image: {type: String, required:true},
    emailVerifiedAt: {type: Date, required: false, default: null}
}, {timestamps: true, versionKey: false})

export default model('User', User)