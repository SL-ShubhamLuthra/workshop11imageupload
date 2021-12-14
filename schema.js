const mongoose=require('mongoose');
const dbconnect=require('./connection');
module.exports=mongoose.Schema({
    
        filename:String,
        imagepath:String,
        imageext:String,
        imagesize:String

});