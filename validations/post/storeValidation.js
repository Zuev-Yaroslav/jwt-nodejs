import validator from "validator";
import fs from "fs";
import path from "path";

const storeValidation = ({ title, text, images }) => {
    var validErrors = {};
    if (!title) {
        validErrors.title = "Title is required";
    }
    if (!text) {
        validErrors.text = "Text is required";
    }
    if (!Array.isArray(images)) {
        validErrors.images = "Images must be array and files";
    } else {
        if (images.length > 10) {
            validErrors.images = "Images should be no more than 10";
        } else {
            const mimeTypes = ["image/png", "image/jpeg", "image/webp"]
            images.forEach((image, index) => {
                if(!mimeTypes.includes(image.mimetype)) {
                    validErrors[`images.${index}.image`] = `${index} image must be png, jpg, webp`
                }
            });
        }
    }
    return validErrors;
}

export default storeValidation;