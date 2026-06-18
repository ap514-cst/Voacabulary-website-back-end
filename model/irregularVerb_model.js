const mongooes=require("mongoose")

const irregularSchema=mongooes.Schema({
     
    infinitive:{
        type:String
    },
    simplepast:{
        type:String
    },
    PastParitciple:{
        type:String
    },
    Bangla:{
        type:String
    },
    explan:{
        type:Stringk
    }


})
const irregularModel=mongooes.model("irregular",irregularSchema)

module.exports=irregularModel