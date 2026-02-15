const userModel = require("../models/user");
const express = require('express');
const profileRouter = express.Router();
const jwt=require('jsonwebtoken');

// Get Data

profileRouter.get("/home", async (req, res) => {
    try {
        const token = req.cookies.LoginToken;
        if(!token){
            return res.status(400).send('Invalid Token')
        }
        const decoded=jwt.verify(token,"SKEY");
        const UserDetails=await userModel.findById(decoded._id);
        res.status(200).json(UserDetails);
    } catch (error) {
        res.status(400).json({ message: "Error in Fetching Login Token" })
    }
})



module.exports = { profileRouter };