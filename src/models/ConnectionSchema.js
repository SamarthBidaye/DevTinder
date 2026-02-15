const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionSchema = new Schema({
    SenderId:{
        type:mongoose.Schema.Types.ObjectId, // for id we always do this as we are using the mongoose schema it provides us with this structure
        required:true,
        ref:"User"
    },
    ReciverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{values:["accepted","ignored","rejected","intrested"],message:`{VALUE} is incorrect type`},
    }
}, { timestamps: true })


module.exports=new mongoose.model("ConnectionRequest",ConnectionSchema);