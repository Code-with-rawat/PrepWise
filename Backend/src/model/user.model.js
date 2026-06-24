const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"this name is already exist"],
        required: true,
    },

    email:{
        type:String,
        unique:[true,"this email is already exist"],
        required: true,
    },

    password:{
        type:String,
        required: true,
    }
})

const User = mongoose.model("User",userSchema);

module.exports = User;