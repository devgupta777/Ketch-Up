const mongoose = require("mongoose");
const chatModel=mongoose.Schema(
    {
        notification:{type:Map,of:String},
        chatName:{type:String,trim:true},
        isGroupChat:{type:Boolean,default:false},
        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        },
        latestMessageIndex:{
            type:Number

        },
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
       

    },
    {
        timestamps:true
    }
);
const Chat=mongoose.model("Chat",chatModel);
module.exports=Chat;