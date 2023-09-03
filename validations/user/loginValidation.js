import validator from "validator";
const loginValidation = ( {username, password} ) => {
    var validErrors = {};
    if (!username) {
        validErrors.username = "Username or email is required";
    }
    if (!password) {
        validErrors.password = "Password is required";
    }
    return validErrors;
}

export default loginValidation;