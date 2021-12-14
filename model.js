const mongoose=require('mongoose');
const dbconnect=require('./connection');
const img_schema=require('./schema');


module.exports=mongoose.model('img_details',img_schema);
