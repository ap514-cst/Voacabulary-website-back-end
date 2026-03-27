const express=require("express");
const { irregularPost, irregularGet, vocBulk } = require("../controller/irregularVerb_controller");
const irregularRoute=express.Router();



irregularRoute.post("/irrPost",irregularPost)
irregularRoute.post("/irrBulk",vocBulk)
irregularRoute.get("/irrGet",irregularGet)



module.exports=irregularRoute