const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Validations for the Signin feild 
const SignInvalidate = async (req, res, next) => {
    try {
        const userReq = req.body;
        const RequiredFeilds = ["firstname", "contact", "email", "password",];
        const ObjectKeys = Object.keys(userReq);
        // const verifyUserBody=RequiredFeilds.every(k=>ObjectKeys.includes(k));
        const verifyUserBody = RequiredFeilds.every(k => k in userReq);
        if (!verifyUserBody) {
            return res.send(`${RequiredFeilds} These input feilds are mandatory`)
        }
        next();
    } catch (error) {
        res.send("Error Occoured : " + error.message)
    }
}

// Login validate
const loginValidate = async (req, res, next) => {

    const { email, password } = req.body;
    const checkUserinDB = await userModel.findOne({
        email
    });
    if (!checkUserinDB) {
        return res.status(400).json({ message: "Email or Password Invalid" });
    }
    const ComparePassword = await bcrypt.compare(password, checkUserinDB.password);
    if (!ComparePassword) {
        return res.status(400).json({ message: "Email or Password Invalid" });
    }
    req.user = checkUserinDB;

    next();
}


// Update User
const UserUpdateFeildsOnly = async (req, res, next) => {
    try {
        const updateValues = Object.keys(req.body);
        const allowedFields = ["firstname", "last", "contact", "age", "about","image"];
        const isValid=updateValues.every(k=>allowedFields.includes(k));
        if(!isValid){
            return res.status(400).send("You have entered the feilds which are not required")
        }
        next();
    } catch (error) {
        res.send("Error " + error.message);
    }
}

module.exports = { SignInvalidate, loginValidate, UserUpdateFeildsOnly };