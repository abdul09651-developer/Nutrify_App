const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:[/@gmail\.com$/,"Only gmail addresses is allowed"]
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true,
        min:12
    }

},{timestamps:true})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;