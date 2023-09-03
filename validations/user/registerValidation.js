import validator from "validator";
import fs from "fs";
import path from "path";

const registerValidation = ({ username, email, password, password_confirm, image }) => {
    var validErrors = {};
    if (!username) {
        validErrors.username = "Username is required";
    }
    if (!email) {
        validErrors.email = "Email is required";
    } else {
        if (!validator.isEmail(email)) {
            validErrors.email = "Need email";
        }
    }
    if (!password) {
        validErrors.password = "Password is required";
    } else {
        if (!validator.isLength(password, { min: 8 })) {
            validErrors.password = "The password must be at least 8 characters"
        } else {
            if (!password_confirm) {
                validErrors.password_confirm = "Password confirmation is required";
            } else {
                if (password !== password_confirm) {
                    validErrors.password_confirm = "Password confirmation error";
                }
            }
        }
    }
    if (!image) {
        validErrors.image = "Image is required and must be file";
    } else {
        const mimeTypes = ["image/png", "image/jpeg", "image/webp"]
        if(!mimeTypes.includes(image.mimetype)) {
            validErrors.image = "Image  must be png, jpg, webp"
        }
    }
    return validErrors;
}

export default registerValidation;