const express=require("express");
const color=require('colors');
const userRouter=require('./routes/userRoutes');
const chatRouter=require('./routes/chatRoutes');
const messageRouter=require('./routes/messageRoutes');
const app=express();
const connectDB=require('./config/db');
const dotenv=require("dotenv");
const {pageNotFound,errorHandler}=require('./middleware/errorhandling');
const path=require('path');

    dotenv.config();
    connectDB();


const PORT=process.env.PORT || 5000;

app.use(express.json());
const server=app.listen(PORT,console.log(`listening on port ${PORT}`.yellow.bold));
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:'http://localhost:3000'
    },
});
io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    
    socket.on('setup',(userdata)=>{
        socket.join(userdata._id);
        socket.emit("connected");
    })
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('user joined room-'+room);
    })
    socket.on('typing',(room)=>socket.in(room).emit('typing',room))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing',room))
    socket.on('new message',(newmessage)=>{
        var chat=newmessage.chat;
        if(!chat.users)
        console.log("chat.users not defined");
    chat.users.forEach(user=>{
        
    socket.in(user._id).emit('message received',newmessage);
    });

    socket.off('setup',()=>{
        console.log('User Disconnected');
        socket.leave(userdata._id);
    });
   


    });



});
app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);



//------------Deployment-----------
const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production')
{
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'));
    });

}
else{
app.get('/',(req,res)=>{
    res.send('API is running successfully');
});
}




//------------Deployment-----------
app.use(pageNotFound);
app.use(errorHandler);






