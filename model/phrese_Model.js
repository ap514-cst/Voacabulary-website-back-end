const mongoose=require("mongoose");

const phreseSchema=mongoose.Schema({
    englishWord:{
        type:String,
        required:true
    },
    banglaMeaning:{
        type:String,
        required:true
    }
})

const phreseModel=mongoose.model("phrese",phreseSchema);

module.exports=phreseModel;