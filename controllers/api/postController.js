import { randomInt } from "crypto"
import Post from "../../models/Post.js"
import User from "../../models/User.js"
import fs from "fs"
import path from "path"
import storeValidation from "../../validations/post/storeValidation.js"
import updateValidation from "../../validations/post/updateValidation.js"
import mongoose from "mongoose"

class postController {
    async index(req, res) {
        try {
            var posts = await Post.aggregate([
                { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
                { $project: { "user.password": 0 } }, { $limit: 1 }
            ])
            return res.json(posts)
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Post index error",  errors: e })
        }
    }
    async show(req, res) {
        try {
            const { id } = req.params
            var post = await Post.aggregate([
                { $match: { "_id": new mongoose.Types.ObjectId(id) } },
                { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
                { $project: { "user.password": 0 } }, { $limit: 1 }
            ])
            if (!post[0]) {
                return res.status(404).json({ message: "Not found" })
            }
            return res.json(post[0])
        } catch (e) {
            console.log(e);
            return res.status(400).json({ message: "Post show error",  errors: e })
        }
    }
    async store(req, res) {
        try {
            const { title, text } = req.body
            var { images } = (req.files && req.files.images) ? req.files : null;
            const validErrors = storeValidation({ title, text, images })

            if (Object.keys(validErrors).length !== 0) {
                return res.status(400).json({ errors: validErrors })
            }
            var images = []
            req.files.images.forEach(image => {
                const imagePath = `storage/posts/images/${Date.now()}${randomInt(1000)}${path.extname(image.name)}`
                image.mv('public/' + imagePath)
                images.push(imagePath)
            });

            const post = new Post({ title, text, images, userId: req.user.id })
            await post.save()
            res.json({ message: "Post successfully created" })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Create post error", errors: e })
        }

    }
    async update(req, res) {
        try {
            var { title, text, imagePathsForDel } = req.body
            const { id } = req.params
            const post = await Post.findById(id, { images: 1 })
            if (!post) {
                return res.status(404).json({ message: "Not found" })
            }

            var { images } = post;
            if (imagePathsForDel) {
                imagePathsForDel.forEach((value, index) => {
                    if (!fs.existsSync("public/" + value)) {
                        imagePathsForDel.splice(index, 1)
                    }
                })
            }
            var newImages = (req.files && req.files.newImages) ? req.files.newImages : null

            const validErrors = updateValidation({ title, text, images, newImages, imagePathsForDel })

            if (Object.keys(validErrors).length !== 0) {
                return res.status(400).json({ errors: validErrors })
            }
            if (newImages) {
                newImages.forEach(image => {
                    const imagePath = `storage/posts/images/${Date.now()}${randomInt(1000)}${path.extname(image.name)}`
                    image.mv('public/' + imagePath)
                    images.push(imagePath)
                });
            }
            if (imagePathsForDel) {
                images.forEach((image, index) => {
                    if (imagePathsForDel.includes(image)) {
                        if (fs.existsSync("public/" + image)) {
                            fs.unlinkSync("public/" + image)
                        }
                        images.splice(index, 1)
                    }
                })
            }
            await Post.findByIdAndUpdate(id, { title, text, images }, { new: true }).then(post => res.json(post))

        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Update post error", errors: e })
        }

    }
    async delete(req, res) {
        try {
            const { id } = req.params
            const post = await Post.findById(id)
            if (!post) {
                return res.status(404).json({ message: "Not found" })
            }
            post.images.forEach(image => {
                image = 'public/' + image
                if (fs.existsSync(image)) {
                    fs.unlinkSync(image)
                }
            })
            await post.deleteOne()
            res.json([])
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Delete post error", errors: e })
        }
    }
}
export default new postController()