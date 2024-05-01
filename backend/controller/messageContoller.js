const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const SendMessage = expressAsyncHandler(async (req, res) => {
    const { message, chatId, index } = req.body;

    if ( !message  || !chatId|| !index) {
         res.status(400).send("Fill all the Fields"); // Return early after sending the response
    }

    try {
        var newMessage = {
            sender: req.user._id,
            content: message,
            chat: chatId
        };

        var newmessage = await Message.create(newMessage);

        newmessage = await Message.findOne({ _id: { $eq: newmessage._id } }).populate("sender", "-password").populate("chat");
        newmessage = await User.populate(newmessage, {
            path: "chat.users",
            select: "-password"
        });

        const newChat = await Chat.findById(chatId);
        newChat.notification.set(req.user._id, index);
        newChat.latestMessage = newmessage._id;
        newChat.latestMessageIndex = index;
        await newChat.save();

        return res.json(newmessage); // Send the response here
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(400).send("Message couldn't be sent"); // Return an error response
    }
});





const AllMessages=expressAsyncHandler(async(req,res)=>{
    try{
        const messages=await Message.find({chat:req.params.chatId}).populate("sender","-password").populate("chat");
        const newChat=await Chat.findById(
            req.params.chatId);
            newChat.notification.set(req.user._id,messages.length-1);
            await newChat.save();
        res.json(messages);

    }
    catch(err)
    {
        res.status(400).send(err.message);
    }
});

module.exports ={SendMessage,AllMessages}