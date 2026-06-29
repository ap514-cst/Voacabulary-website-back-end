const {googleLogin}=require("../controller/google_controller");

const express=require("express")
const Googlerouter=express.Router();

Googlerouter.get("/test",(req,res)=>{
    res.send("google login test");
});

Googlerouter.get("/google",googleLogin);

module.exports=Googlerouter;
