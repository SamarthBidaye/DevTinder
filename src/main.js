const express=require("express");

const app=express();

app.use("/home",(req,res)=>{
    res.send("Namaste Server")
})

app.use("/test",async(req,res)=>{
    res.send("This is the test link")
})

app.listen(7777,()=>{
    console.log('Hello From Server')
});