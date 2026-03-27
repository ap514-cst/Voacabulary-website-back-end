const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema({

  englishWord:{
    type:String,
    required:true
  },

  banglaMeaning:{
    type:String,
    required:true
  },

  explanation:{
    type:String
  },

  audio:{
    type:String
  },
  level:{
    type:String,
    enum:["basic","intermediate","advanced"],
    required:true
  }

});

const vocModel= mongoose.model("Vocabulary", vocabularySchema);
module.exports=vocModel