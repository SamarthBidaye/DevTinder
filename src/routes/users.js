const ConnectModel = require('../models/ConnectionSchema');
const express = require("express");
const usersRoute = express.Router();
const { verifyUser } = require('../controllers/jwtVerifyController');


// Get All the recived requests
usersRoute.get('/user/recived_requests', verifyUser, async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const findIntrestedId = await ConnectModel.find({ ReciverId: loggedUser, status: "intrested" }).populate("SenderId",["firstname","last","about","skills"]);
        if (findIntrestedId.length <= 0) {
            return res.status(400).json({ message: "No Intrested User Found" })
        }
        console.log(findIntrestedId)
        res.json({message:"Intrested Users : "} + findIntrestedId)
    } catch (error) {
        res.status(400).json({message:"Something Went Wrong"} + error.message);
    }
})

module.exports = { usersRoute }