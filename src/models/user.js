const mongoose=require("mongoose");
const {Schema} =mongoose
const validator=require("validator");
const jwt=require("jsonwebtoken");

const userSchema=new Schema(
    {
        firstname:{
            type:String,
            required:true,
            minlength:4,
            maxlength:30,
        },
        last:{
            type:String,
            minlength:4,
            maxlength:15,
        },
        contact:{
            type:Number,
            required:true,
            maxlength:10,
        },
        age:{
            type:Number,
            min:15,
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            unique:true,
            trim:true,
            validate:(value)=>{
                return validator.isEmail(value) //Need to install that lib from npm (Validator)
            }
        },
        password:{
            type:String,
            minlength:8,
            required:true,
            validate:(value)=>{
                return validator.isStrongPassword(value)
            }
        },
        about:{
            type:String,
            default:'This is User Default.',
            minlength:0,
            maxlength:40,
        },
        skills:{
            type:[String],
            default:[],
            validate:{
                message:"Max 5 skills allowed",
                validator:v=>v.length<=5,
            }
        },
        image:{
            type:String,
            default:"https://t3.ftcdn.net/jpg/04/85/67/08/360_F_485670810_kCPqkWudAgcVpt8vIRiH95tBrxT33RwN.jpg"
        }
    },{timestamps:true}
)


module.exports=mongoose.model("User",userSchema);