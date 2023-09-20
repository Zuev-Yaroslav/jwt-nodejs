import validator from "validator";

export default ({email}) => {
    var validErrors = {}
    if (!email) {
        validErrors.email = "Email is required";
    } else {
        if (!validator.isEmail(email)) {
            validErrors.email = "Email must be email";
        }
    }
    return validErrors;
}