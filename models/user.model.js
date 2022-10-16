const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const User = new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true}
    },{collation:{locale: 'en_US',strength:1}}
  );
  
const model = mongoose.model("user-data", User);

module.exports=model