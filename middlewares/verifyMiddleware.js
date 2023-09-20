export default async (req, res, next) => {
    if (!req.user.emailVerifiedAt) {
        return res.status(403).json({message: "Email is not verified"})
    }
    next()
}