import validator from "validator";
import fs from "fs";
import path from "path";

const updateValidation = ({ title, text, images, newImages, imagePathsForDel }) => {
    var validErrors = {};
    newImages = (newImages) ? newImages : []
    imagePathsForDel = (imagePathsForDel) ? imagePathsForDel : []
    if (images.length - imagePathsForDel.length <= 0 && newImages.length === 0) {
        validErrors.images = "Images is required";
    }
    if (images.length + newImages.length - imagePathsForDel.length > 10) {
        validErrors.images = "Images should be no more than 10";
    } else {
        const mimeTypes = ["image/png", "image/jpeg", "image/webp"]
        newImages.forEach((image, index) => {
            if (!mimeTypes.includes(image.mimetype)) {
                validErrors[`newImages.${index}.image`] = `${index} image must be png, jpg, webp`
            }
        });
    }
    return validErrors;
}

export default updateValidation;