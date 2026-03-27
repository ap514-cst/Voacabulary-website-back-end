const express=require("express");
require("dotenv").config()
const cors=require("cors");
const mongoose=require("mongoose")
const userRouter=require("./router/user_router")
const vocRouter=require("./router/data_router")
const irregularRouter=require("./router/irregularVerb")
const app=express();


//middleware 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//router
app.use("/api/users",userRouter)
app.use("/api/data",vocRouter)
app.use("/api/data",irregularRouter)
app.use("/audio", express.static("audio"));

const PORT=process.env.PORT || 2000;
const MONGODB_URL=process.env.MONGODB_URL;

app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);

    mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log("database connected");
        
    }).catch((err)=>{
        console.log(err)
    })

    
})