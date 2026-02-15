const mongoose=require("mongoose");
const {connect}=mongoose; //we have destructured connect from mongoose and used it (insted of mongoose.connect)

async function connectDB(){
    await connect("mongodb+srv://Samarth12:yadojiB12@devtinder.ldvdia7.mongodb.net/?appName=devtinder");
}

module.exports={connectDB}