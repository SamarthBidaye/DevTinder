const userModel = require("../models/user");
const express = require('express');
const authRouter = express.Router();
const { SignInvalidate, loginValidate } = require('../middleware/authMiddleware');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { verifyUser } = require('../controllers/jwtVerifyController');
const {UserUpdateFeildsOnly}=require('../middleware/authMiddleware')


// Sign in api
authRouter.post("/api/signin", SignInvalidate, async (req, res) => {
    try {
        const { firstname, last, contact, age, email, password, about, skills, image } = req.body;
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
            skills,
            image
        })

        await createNewUser.save();
        console.log(createNewUser)
        res.status(200).json({ message: "User Added Successfully" ,user: createNewUser} )
    } catch (error) {
        res.status(200).json({ message: "Something went wrong while creating New User" } + error.message)
    }
})


// Login api
authRouter.post("/api/login", loginValidate, (req, res) => {
    try {
        const RecivedLoginObject = req.user;
        const token = jwt.sign({ _id: RecivedLoginObject._id }, "SKEY", { expiresIn: "1d" });
        res.cookie("LoginToken", token, { httpOnly: true, });
        res.status(200).json({ message: "User Login Success!" , User:RecivedLoginObject});
    } catch (error) {
        res.status(400).json({ message: "Something went wrong !", error: error.message});
    }
})


// Logout api
authRouter.post("/api/logout", (req, res) => {
    res.clearCookie("LoginToken",{
        httpOnly:true,
    });
    res.send("Logout Complete");
});


// Update the profile
authRouter.patch("/api/update", verifyUser, UserUpdateFeildsOnly, async (req, res) => {
    try {
        const userId = req.user._id;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ updatedUser });
    } catch (error) {
        res.status(400).send("Something Went Wrong! " + error.message);
    }
});

module.exports = { authRouter }