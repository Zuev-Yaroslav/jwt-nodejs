import { Schema, model } from "mongoose";

const User = new Schema({
    username: {type: String, unique: true, requred: true},
    email: {type: String, unique: true, requred: true},
    password: {type: String, requred: true},
    roles: [{type: String, ref: 'Role'}],
    image: {type: String, required:true},
}, {timestamps: true, versionKey: false})

export default model('User', User)