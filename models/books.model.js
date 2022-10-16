const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const Books = new mongoose.Schema(
    {
        author:{type:String,required:true},
        country:{type:String,required:true,unique:true},
        imageLink:{type:String,required:true},
        language:{type:String,required:true},
        link:{type:String,required:true},
        pages:{type:String,required:true},
        title:{type:String,required:true},
        year:{type:String,required:true},
    },{collation:{locale: 'en_US',strength:1}}
  );
  
const model = mongoose.model("books", Books);

module.exports=model