import React, { useEffect, useState } from 'react'
import { Chatstate } from '../Context/Contextprovider'
import { Box, Button, FormControl, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import Other, { OtherFull } from '../Chatslogic/Other'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModel from './UpdateGroupChatModel'
import axios from 'axios'
import './message.css'
import Chat from './Chat'
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animation/typing.json'

const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat}=Chatstate()
    const toast=useToast()
    const [messages,setMessages]=useState([])
    const [loading,setLoading]=useState(false)
    const [socketconnected,setSocketConnected]=useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
    const [newMessage,setNewMessage]=useState("")
    const [chatmap,setChatMap]=useState([])
   

const defaultOptions={
  loop:true,
  autoplay:true,
  animationData:animationData,
  renderSettings:{
    preserveAspectRatio:'xMidYMid slice'
  }

};


    const typingHandler=(e)=>{
      setNewMessage(e.target.value)
      if(!socketconnected)
      return;
    if(!typing)// some reason below
    {
    setTyping(true)
  socket.emit('typing',selectedChat._id)
    }
    
    setTimeout(()=>{

    if(typing) // to prevent multiple emit as once it is false , no need to emit again and waste bandwidth
    {
        socket.emit('stop typing',selectedChat._id);
        setTyping(false)
    }
     
    },5000)
          }
   
    useEffect(()=>{
socket=io(ENDPOINT)
socket.emit('setup',user)

socket.on('connected',()=>setSocketConnected(true))
socket.on('typing',(room)=>{
  setChatMap([...chatmap,room])
  setIsTyping(true)
 
})
socket.on('stop typing',(room)=>{
  for(let i=0;i<chatmap.length;i++)
  {
    if(chatmap[i]===room)
    {
    chatmap.splice(i,1);
    break;
    }

  }
  setChatMap(chatmap)
  setIsTyping(false)
})

    },[])

    useEffect(()=>{
      
      fetchMessage()
      
      selectedChatCompare=selectedChat;
     
    },[selectedChat])
    
    useEffect( ()=>{
      socket.on('message received',(message)=>{
        
       
        if(!selectedChatCompare || selectedChatCompare._id!== message.chat._id)
        {
          setFetchAgain(!fetchAgain)
        }
        else{
          setNotification()
          setFetchAgain(!fetchAgain)
          setMessages([...messages,message])
          
        }
       
      })  
    })
    

    const setNotification=async()=>{
      if(!selectedChat || !selectedChat.latestMessage)
      return;
    try{
      const config={
        headers:
        {
        
          Authorization:`Bearer ${user.token}`
        }
      };
      const {data}=await axios.put('/api/chat/update',{
        chatId:selectedChat._id,
        index:""+((!messages) ? 0: messages.length)

      },config);
       return console.log(data);
    } 
    catch(err)
    {
      toast({
        title: "Notification can't be acessed",
        status: 'error',
        duration: 2000,
        isClosable: true,
        description:err.response.data.message,
        position:'bottom'
      });
      return;
    }
  }
   
    const fetchMessage=async()=>{
      if(!selectedChat)
      return;
    try{
     
      setLoading(true)
      const config={
        headers:
        {
        
          Authorization:`Bearer ${user.token}`
        }
      };
     
      const {data}=await axios.get(`/api/message/${selectedChat._id}`,config);
      
    setFetchAgain(!fetchAgain)
    
    setMessages(data)
    
   socket.emit('join chat',selectedChat._id)
  
   setLoading(false)
   
   
    }
    catch(err)
    {
      toast({
        title: "Messages can't be acessed",
        status: 'error',
        duration: 2000,
        isClosable: true,
        description:err.response.data.message,
        position:'bottom'
      });
      setLoading(false)


    }
    }
    const check=()=>{
      for(let i=0;i<chatmap.length;i++)
      {
        if(chatmap[i]===selectedChat._id)
        {
          return 1;
        }
      }
      return 0;

    }
    const SendMessage=async(event)=>{
      if(event.key==='Enter' && newMessage)
      {
        socket.emit('stop typing',selectedChat._id);
        try{
          const config={
            headers:
            {
              "Content-Type":"application/json",
              Authorization:`Bearer ${user.token}`
            }
          };
        
          setNewMessage("")
            const {data} = await axios.post('/api/message',{
              message:newMessage,
              chatId:selectedChat._id,
              index:""+((!messages) ? 0: messages.length)
            },config);
       
           socket.emit('new message',data)
           setFetchAgain(!fetchAgain) && console.log('a')
            setMessages([...messages,data]) && console.log('b')
           

         
          }

        
        catch(error)
        {
          toast({
            title: 'Message Not Sent',
            status: 'error',
            duration: 2000,
            isClosable: true,
            description:error.response.data.message,
            position:'bottom'
          });

        }
      }

    }

  return (
    <>
    {selectedChat ? (<>
    <Box display="flex" flexDirection="row" justifyContent="space-between" p="3xl" w="100%">
        <Button size="sm" display={{base:"flex" , md:"none"}}><ArrowBackIcon  fontSize="2xl" onClick={()=>setSelectedChat(null)}/></Button>
        <Text fontFamily="work sans " fontSize="2xl" >{!selectedChat.isGroupChat ? Other(user,selectedChat.users) : selectedChat.chatName }</Text>
       {!selectedChat?.isGroupChat ?<ProfileModal user={OtherFull(user,selectedChat.users)} /> :<UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessage={fetchMessage} />}

    </Box>
    <Box 
    display="flex" flexDirection="column" justifyContent="flex-end" p="3" bg="#FFFBFB" borderRadius="lg" overflowY="auto" borderWidth="1px" w="100%" h="100%" m="2" 
    >
      
{ loading  ? <Spinner margin="auto" alignSelf="center" size="xl" h="20" w="20"  /> : <div className="messages">
  <Chat messages={messages} /></div>}
  {(isTyping && check()) ?<div>
    <Lottie 
    options={defaultOptions}
    width={70}
    style={{ marginLeft:"5px", marginBottom:15}}
    />
  </div>:<></>}
<FormControl isRequired onKeyDown={(e)=>SendMessage(e)} mt={3}>

  <Input variant='filled' bg="#E0E0E0" placeholder='Enter a message' onChange={(e)=>typingHandler(e)} value={newMessage} />
</FormControl>


    </Box>
    </>) : <Box justifyContent="center" h="100%" display="flex" alignItems="center"><Text fontFamily="work sans " fontSize="2xl"  > Click on user to start Chatting </Text></Box> }
    </>
  )
}

export default SingleChat