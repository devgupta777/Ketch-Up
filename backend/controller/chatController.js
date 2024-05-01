const expressAsyncHandler = require("express-async-handler");
const Chat=require('../models/chatModel');
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const accessChat=expressAsyncHandler(async(req,res)=>{
const {userId}=req.body;
if(!userId)
{
console.log("userid param not sent with request");
return res.sendStatus(400);
}
var isChat=await Chat.find(
    {
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:userId}}},
            {users:{$elemMatch:{$eq:req.user._id}}},
        ]
        
    }
).populate("users","-password").populate("latestMessage");
isChat=await User.populate(isChat,
    {
        path:"latestMessage.sender",
        select:"name email pic",
    });

    if(isChat.length>0)
    {
        console.log("1");
        res.status(200).send(isChat[0]);
    }
    else{
        var chat={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
          notification:{}
        };
        try{
            const createChat= await Chat.create(chat);
            const FullChat= await Chat.findOne({_id:createChat._id}).populate("users","-password").populate('latestMessage');
            res.status(200).send(FullChat);
            console.log("2");
        }
        catch(err)
        {
            res.status(400);
            throw new Error(err.message);
        }

    }

    
});
const fetchChat=expressAsyncHandler(async(req,res)=>{
    try{
     var result=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}}).populate("users","-password").populate("latestMessage").populate("groupAdmin","-password").sort({updatedAt:-1});
       result=await User.populate(result,  
        {
        path:"latestMessage.sender",
        select:"name email pic",
    });
        res.status(200).send(result);
        

    }
    catch(err)
    {
res.status(400);
throw new Error(err.message);
    }

});
const createGroupChat=expressAsyncHandler(async(req,res)=>{
   if(!req.body.users || !req.body.name) 
   {
    res.status(400);
    throw new Error("Fill all the Fields");

   }

   var users=JSON.parse(req.body.users);
   if(users.length<2)
   {
    res.status(400);
    throw new Error("Group must have atleast three user");
   }

   users.push(req.user);
   console.log(users);
   try{
    const groupChat=await Chat.create(
        {
            chatName:req.body.name,
            isGroupChat:true,
            users:users,
            groupAdmin:req.user,
            notification:{},
        }
    );
    console.log(groupChat);
    const fullChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password");
    res.status(200).send(fullChat);

   }
   catch(err)
   {
    res.status(400);
    throw new Error(err.Message); 
   }
});
const renameGroup=expressAsyncHandler(async(req,res)=>{
    if(!req.body.chatId || !req.body.newname)
    {
        res.status(400);
        throw new Error("Fill all the Fields");
    
    }
    const {chatId,newname}=req.body;
    
    try{
        const updateChat=await Chat.findOneAndUpdate(
            {
                _id:chatId,
                users:{$eq:req.user._id}
            },
            {
                chatName:newname
            },
            {
                new:true
            }
        ).populate("users","-password").populate("groupAdmin","-password");
        if(updateChat)
        res.status(200).send(updateChat);
    else
    res.status(400);
throw new Error("Not a part of this Group");
    }
    catch(err)
    {
        res.status(400);
        throw new Error(err.message);
    }
});
const addIntoGroup=expressAsyncHandler(async(req,res)=>{
    if(!req.body.chatId || !req.body.userId)
    {
        res.status(400).send("fill all the fields");
    }
    const {chatId,userId}=req.body;
    try{
        const newChat=await Chat.findByIdAndUpdate(
            chatId,
               { $push:{users:userId}
               
            }, {
                new:true
            }
        ).populate("users","-password").populate("groupAdmin","-password");
        if(newChat)
        res.status(200).send(newChat);
    else
    res.status(400).send("chat doesn't exist");

    }
    catch(err)
    {
        res.status(400).send(err.message);
    }
});
const updateNotification=expressAsyncHandler(async(req,res)=>{
    if(!req.body.chatId || !req.body.index )
    {
        res.status(400).send("fill all the fields");
        return;
    }
    const {chatId,index}=req.body;
    const a=req.user._id;
    try{
        const newChat=await Chat.findById(
            chatId);
            newChat.notification.set(a,index);
            await newChat.save();
        if(newChat)
       return res.status(200).send(newChat);
    else
   return res.status(400).send("chat doesn't exist");

    }
    catch(err)
    {
       return res.status(400).send(err.message);
    }
});
const removeFromGroup=expressAsyncHandler(async(req,res)=>{
    if(!req.body.chatId || !req.body.userId)
    {
        res.status(400).send("fill all the fields");
    }
    const {chatId,userId}=req.body;
    try{
        const newChat=await Chat.findByIdAndUpdate(
            chatId,{users:{$eq:userId}}?
                {$pull:{users:userId}}:
            {}, {
                new:true
            }
        ).populate("users","-password").populate("groupAdmin","-password");
        if(newChat)
        res.status(200).send(newChat);
    else
    res.status(400).send("chat doesn't exist");

    }
    catch(err)
    {
        res.status(400).send(err.message);
    }
});
module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addIntoGroup,removeFromGroup,updateNotification};