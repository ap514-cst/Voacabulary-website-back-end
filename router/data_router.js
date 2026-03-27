const express=require("express");
const { vocPOST, vocGET, vocPOSTBulk, vocALL } = require("../controller/data_contorller");
const vocRouter=express.Router();


vocRouter.post("/vocPOST",vocPOST);

vocRouter.get("/vocGET/level",vocGET)
vocRouter.get("/voc",vocALL)
vocRouter.post("/add-words-bulk",vocPOSTBulk)

module.exports=vocRouter;