const express = require("express");
const { connectDB } = require("./config/database")
const app = express();
app.use(express.json())
const cors=require("cors");
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
const cookie = require('cookie-parser')
app.use(cookie()); //Required to parse the incoming request from http (Helps in reading the http data by converting into json)
const {authRouter}=require('./routes/auth');
const {profileRouter}=require('./routes/profile');
const {usersRoute}=require('./routes/users');
const request=require('./routes/request');

app.use('/auth',authRouter);
app.use('/user',profileRouter);
app.use('/request',request);
app.use('/get',usersRoute);

connectDB().then(() => {
    console.log("Connected to Database Successfully");
    app.listen(8080, () => {
        console.log("Server Connection Established.")
    })
}).catch(err => {
    console.error("Failed Connection to Database", err);
})