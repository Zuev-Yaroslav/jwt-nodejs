import Post from "../models/Post.js"

export default async (req, res, next) => {
    const {id} = req.params
    const {userId} = await Post.findById(id, {userId: 1})
    if (req.user.id !== userId.toString()) {
        return res.status(403).json({message: "You don't have access"})
    }
    next()
}