const mongooes=require("mongoose");

const userSchema=new mongooes.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    number:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true,

    }

},{timestamps:true})

const UserModel=mongooes.model("vocUsers",userSchema);

module.exports=UserModel;