const ConnectModel = require('../models/ConnectionSchema');
const express = require("express");
const usersRoute = express.Router();
const { verifyUser } = require('../controllers/jwtVerifyController');
const { connect } = require('mongoose');

const SAFE_DATA=["firstname","last","about","skills"]

// Get All the recived requests
usersRoute.get('/user/recived_requests', verifyUser, async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const findIntrestedId = await ConnectModel.find({ ReciverId: loggedUser, status: "intrested" }).populate("SenderId", SAFE_DATA);
        if (findIntrestedId.length <= 0) {
            return res.status(400).json({ message: "No Intrested User Found" })
        }
        console.log(findIntrestedId)
        res.json({ message: "Intrested Users : " } + findIntrestedId)
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong" } + error.message);
    }
})


// Get all my connections (accepted connections);
usersRoute.get('/user/accepted', verifyUser, async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const getAcceptedUsers = await ConnectModel.find({
            $or: [
                { ReciverId: loggedUser, status: "accepted" },
                { SenderId: loggedUser, status: "accepted" }
            ]
        }).populate("SenderId",SAFE_DATA).populate("ReciverId",SAFE_DATA);
        // I am not able to get who is sender or reciver
        getAcceptedUsers.map(connection=>{
            if(connection.SenderId._id.toString()===loggedUser.toString()){
                return console.log(connection.ReciverId);
            }else{
                return console.log(connection.SenderId);
            }
        })
        res.status(200).json({message:"Accepted Requests"} + getAcceptedUsers);
    } catch (error) {
        res.json({message:error.message})
    }
})


module.exports = { usersRoute }