const userModel = require("../models/user");
const express = require('express');
const authRouter = express.Router();
const { SignInvalidate, loginValidate } = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyUser } = require('../controllers/jwtVerifyController');
const {UserUpdateFeildsOnly}=require('../middleware/authMiddleware')


// Sign in api
authRouter.post("/signin", SignInvalidate, async (req, res) => {
    try {
        const { firstname, last, contact, age, email, password, about, skills } = req.body;
        const userEmail = await userModel.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ message: "Email Already Registered, Try Login" })
        }

        const HashedPass = await bcrypt.hash(password, 10);

        const createNewUser = new userModel({
            firstname,
            last,
            contact,
            age,
            email,
            password: HashedPass,
            about,
            skills
        })

        await createNewUser.save();
        console.log(createNewUser)
        res.status(200).json({ message: "User Added Successfully" } + createNewUser)
    } catch (error) {
        res.status(200).json({ message: "Something went wrong while creating New User" } + error.message)
    }
})


// Login api
authRouter.post("/login", loginValidate, (req, res) => {
    try {
        const RecivedLoginObject = req.user;
        const token = jwt.sign({ _id: RecivedLoginObject._id }, "SKEY", { expiresIn: "1d" });
        res.cookie("LoginToken", token, { httpOnly: true, });
        res.status(200).json({ message: "User Login Success!" });
    } catch (error) {
        res.status(400).json({ message: "Something went wrong !" } + error.message);
    }
})


// Logout api
authRouter.post("/logout", (req, res) => {
    res.clearCookie("LoginToken");
    res.send("Logout Complete");
});


// Update the profile
authRouter.patch("/update", verifyUser,UserUpdateFeildsOnly, async (req, res) => {
    try {
        const UserId = req.user._id; // We Get the user id
        const {firstname} = req.body;
        const UpdateData = await userModel.findByIdAndUpdate(UserId, {firstname}, { new: true, runValidators: true });
        res.json({Updated_Data:UpdateData});
        console.log(UpdateData);
        
    } catch (error) {
        res.status(400).send("Something Went Wrong ! "+ error.message);
    }
})

module.exports = { authRouter }