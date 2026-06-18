const express=require("express");
const { addPhrese, bulkaddPhress, getPhrese } = require("../controller/phrese_controller");
const phreseRouter=express.Router();


phreseRouter.post("/addphrese",addPhrese);
phreseRouter.post("/bulkaddphrese",bulkaddPhress)
phreseRouter.get("/getphrese",getPhrese)

module.exports=phreseRouter;
