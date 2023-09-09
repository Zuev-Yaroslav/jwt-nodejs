import { Schema, model } from "mongoose";

const Post = new Schema({
    title: {type: String, unique: true, required: true},
    text: {type: String, required: true},
    images: [{type: String}],
    userId: {type: Schema.Types.ObjectId, ref: "User"},
}, {timestamps: true, versionKey: false})

export default model('Post', Post)