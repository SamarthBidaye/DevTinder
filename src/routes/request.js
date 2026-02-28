const ConnectModel = require('../models/ConnectionSchema');
const userModel = require("../models/user");
const express = require("express");
const request = express.Router();
const { verifyUser } = require('../controllers/jwtVerifyController');


// Send Connection Request
request.post("/send/:status/:toUserId", verifyUser, async (req, res) => {
    try {
        const FromUser = req.user._id;
        const ToUserData = req.params.toUserId;
        const status = req.params.status;

        const ALLOWED_STATUS = ["ignored", "intrested"];

        const statusValidate = ALLOWED_STATUS.includes(status)
        if (!statusValidate) {
            return res.status(400).json({ message: "Invalid  Request Type" });
        }

        const CheckForSameUser = (FromUser.toString() === ToUserData)
        if (CheckForSameUser) {
            return res.status(400).json({ message: "Cannot Send request for Yourself" })
        }

        const alreadyExists = await ConnectModel.findOne({
            $or: [{ SenderId: FromUser, ReciverId: ToUserData }, { ReciverId: FromUser, SenderId: ToUserData }]
        }
        )

        if (alreadyExists) {
            return res.status(400).json({ message: "Request Already in Queue" })
        }

        const ConnectionReq = ConnectModel({
            SenderId: FromUser,
            ReciverId: ToUserData,
            status
        })
        await ConnectionReq.save();

        res.send("Request Sent" + ConnectionReq);
    } catch (error) {
        res.send("Something Went Wrong " + error.message)
    }
});


// Want to see requests sent by users
request.get("/recivedRequests", verifyUser, async (req, res) => {
    try {
        const SeeAllReq = await ConnectModel.find({ ReciverId: req.user._id });
        res.send("Your Requests " + SeeAllReq);
    } catch (error) {
        res.send("Something Went Wrong " + error.message);
    }
})

// See All the request sent by an user

request.get("/allReqSentByUser", verifyUser, async (req, res) => {
    try {
        const findAllRequests = await ConnectModel.find({ SenderId: req.user._id });
        console.log(findAllRequests);
        res.send("All Requests Send : " + findAllRequests);
    } catch (error) {
        res.send("Something Went Wrong " + error.message)
    }
})


// Check which user is logged in
request.get("/checkloggedUser", verifyUser, async (req, res) => {
    try {
        const findLoggedUser = await userModel.findById(req.user._id)
        console.log(findLoggedUser)
        res.status(200).json({ message: "Logged User details", data: findLoggedUser })
    } catch (error) {
        res.send("Unable to Fetch the Logged User", error.message)
    }
})

// Approve/reject the request sent by the user
request.post('/recive/:status/:connectionId', verifyUser, async (req, res) => {
    try {
        const loggedUser = req.user._id
        // console.log(loggedUser)
        const { status, connectionId } = req.params;
        const AllowedStatus = ["accepted", "rejected"];
        const isAllowed = AllowedStatus.includes(status);
        if (!isAllowed) {
            return res.status(400).json({ message: "Status not valid" })
        }
        const findUser = await ConnectModel.findOne({
            _id: connectionId,
            ReciverId: loggedUser,
            status: "intrested"
        })
        if (!findUser) {
            return res.status(401).json({ message: "User Request Not Found !" })
        }
        findUser.status = status;
        await findUser.save();
        if (status === "accepted") {
            return res.json({ message: "Accepted Complete" })
        } else if (status === "rejected") {
            return res.json({ message: "User Rejected" })
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }

})

// api to check the users who have accepted the request

// find the logged in user as he/she will be accepting the requets
// for recivedId check status if status is accepted then get the documentId of that user
request.get('/allAcceptedUser', verifyUser, async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        if (!loggedUserId) {
            return res.status(400).json({ message: "No Logged User Exists" });
        }
        const getAllUsers = await ConnectModel.find({ ReciverId: loggedUserId, status: "accepted" });
        if (getAllUsers.length <= 0) {
            return res.status(400).json({ message: "No Request have been approved" });
        }
        // To Find Details or firstName of all the accepted users
        const ApprovedReqSenderID = getAllUsers[0].SenderId.toString();
        const ResponceUserDetails = await userModel.findById(ApprovedReqSenderID);
        console.log(ResponceUserDetails.firstname);

        res.send("Request Approved Users are : " + getAllUsers);
    } catch (error) {
        res.status(400).send("Error " + error.message)
    }
})

module.exports = request;