import { Schema, model } from "mongoose";

const Post = new Schema({
    title: {type: String, unique: true, requred: true},
    text: {type: String, requred: true},
    images: [{type: String}],
    userId: {type: Schema.Types.ObjectId, ref: "User"},
})

export default model('Post', Post)