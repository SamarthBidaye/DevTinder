const ConnectModel = require('../models/ConnectionSchema');
const express = require("express");
const usersRoute = express.Router();
const { verifyUser } = require('../controllers/jwtVerifyController');
const { connect } = require('mongoose');
const userModel = require('../models/user');

const SAFE_DATA = ["firstname", "last", "about", "skills","image"]

// Get All the recived requests
usersRoute.get('/api/user/recived_requests', verifyUser, async (req, res) => {
    try {
        const loggedUser = req.user._id;

        const findIntrestedId = await ConnectModel
            .find({ ReciverId: loggedUser, status: "intrested" })
            .populate("SenderId", SAFE_DATA);

        if (findIntrestedId.length === 0) {
            return res.status(200).json({ message: "No Intrested User Found", data: [] });
        }

        res.status(200).json({
            message: "Intrested Users data",
            data: findIntrestedId
        });

    } catch (error) {
        res.status(500).json({ message: "Something Went Wrong", error: error.message });
    }
});


// Get all my connections (accepted connections);
usersRoute.get('/api/user/accepted', verifyUser, async (req, res) => {
    try {
        const loggedUser = req.user._id;
        const getAcceptedUsers = await ConnectModel.find({
            $or: [
                { ReciverId: loggedUser, status: "accepted" },
                { SenderId: loggedUser, status: "accepted" }
            ]
        }).populate("SenderId", SAFE_DATA).populate("ReciverId", SAFE_DATA);
        // I am not able to get who is accepted sender or reciver
        getAcceptedUsers.map(connection => {
            if (connection.SenderId._id.toString() === loggedUser.toString()) {
                return console.log(connection.ReciverId);
            } else {
                return console.log(connection.SenderId);
            }
        })
        res.status(200).json({ message: "Accepted Requests" } + getAcceptedUsers);
    } catch (error) {
        res.json({ message: error.message })
    }
})

// Feed API (MAIN PAGE API TO DISPLAY ALL DATA);
// getlogged User
// not display own profile
// not display req accepted profile
// no rejected and ignore
usersRoute.get('/api/user/core', verifyUser, async (req, res) => {
    try {
        const limit=parseInt(req.query.limit)||4;
        const page=parseInt(req.query.page)||1;
        const skip=(page-1)*limit;
        const loggedUser = req.user._id;
        const Connections = await ConnectModel.find(
            {
                $or: [
                    { SenderId: loggedUser },
                    { ReciverId: loggedUser }
                ]
            }
        ).select(["SenderId", "ReciverId"]);

        const hideActionId=new Set();

        Connections.forEach(element => {
            hideActionId.add(element.SenderId._id.toString()),
            hideActionId.add(element.ReciverId._id.toString())
        });

        hideActionId.add(loggedUser.toString());
        // console.log(hideActionId);

        const DataExpHideAction=await userModel.find({_id:{$nin:[...hideActionId]}}).select(SAFE_DATA).skip(skip).limit(limit);

        res.status(200).json({
            message: "Users",
            feeddata: DataExpHideAction
        });
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong" ,error: error.message});
    }
})



// Get All Send Users
usersRoute.get('/api/user/sentreq',verifyUser,async(req,res)=>{
    try {
        const loggedUser=req.user._id
        const findSenderRequests=await ConnectModel.find({SenderId:loggedUser,status:"intrested"}).populate("ReciverId",["firstname","last","email","image"])
        res.status(200).json({message:"User Fetched",fetchedData:findSenderRequests})
    } catch (error) {
        res.status(400).json({message:"Could not Find any User"})
    }
})

module.exports = { usersRoute }