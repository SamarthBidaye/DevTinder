
const express = require("express");
const { connectDB } = require("./config/database")
const app = express();
app.use(express.json())
const cors=require("cors");

app.use(cors({
    origin:"http://16.171.200.44",
    credentials:true
}));
const cookie = require('cookie-parser')
app.use(cookie()); //Required to parse the incoming request from http (Helps in reading the http data by converting into json)
const {authRouter}=require('./routes/auth');
const {profileRouter}=require('./routes/profile');
const {usersRoute}=require('./routes/users');
const request=require('./routes/request');

app.use('/api/auth',authRouter);
app.use('/api/user',profileRouter);
app.use('/api/request',request);
app.use('/api/get',usersRoute);

connectDB().then(() => {
    console.log("Connected to Database Successfully");
    app.listen(8080, () => {
        console.log("Server Connection Established.")
    })
}).catch(err => {
    console.error("Failed Connection to Database", err);
})