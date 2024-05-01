import React, { useEffect, useState } from 'react'
import { Chatstate } from '../Context/Contextprovider'
import { Box, useToast,Text, Button, Stack, Tooltip } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import Skeletoncompo from './Skeletoncompo';
import Other from '../Chatslogic/Other';
import Makegroup from './Makegroup';


const Chats = ({fetchAgain}) => {

  
  const {user,setSelectedChat,selectedChat,chats,setChats}=Chatstate();
  const [loggedUser,setLoggedUser]=useState();
  const toast=useToast()


  const fetchChats=async()=>{
    try{
      const config={
        headers:
        {
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.get('/api/chat',config)
      setChats( data)
     

    }
    catch(err)
    {
      toast({
        title: "Couldn't access chat",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position:'bottom',
        description:err.response.data.message
    })

  }
}

useEffect(()=>{

setLoggedUser(JSON.parse(localStorage.getItem("Info")))
fetchChats()

},[fetchAgain])


  return (
    
<Box display={{base:selectedChat?"none" : "flex",md:"flex"}} w={{base:"100%" ,md:"30%"}} flexDirection="column" alignItems="center" bg="white" 
 borderRadius="lg" p="4">
  <Box display="flex"  justifyContent="space-between" mb="1" fontSize="30px" fontFamily="work sans" p="2" w="100%">
  <Text mb='2' >My Chats</Text>

  <Makegroup> 

 <Button   justifyContent="center" display="flex" py='7px' fontSize='md' rightIcon={<AddIcon/>}>{ ((window.innerWidth<=390) ||  (window.innerWidth>=700 &&  window.innerWidth <= 1185)) ? "" :"Create Group"}</Button> 

    </Makegroup>

   

  </Box>
  <Box display="flex" flexDirection="column" w="100%" alignItems="center" p="3" borderRadius="lg"  overflowY="scroll" bg="#F8F8F8">
   {chats ?(
    <Stack  w="100%">
      {
       
        chats?.map((chat)=>{
     
         var b=(!chat.latestMessage)? null : (!chat.notification[user?._id])? (chat.latestMessageIndex+1-0):chat.latestMessageIndex-Number(chat.notification[user?._id])
   
          return (
        
          <Box
          display="flex" justifyContent="space-between"
          onClick={()=>setSelectedChat(chat)}
          cursor="pointer"
          key={chat._id}
          borderRadius="lg" 
          px="3"
          py="2"
          h='55px' overflowY='hidden'
          _hover={{background:"#6F6F6F",color:"white"}}
          bg={(selectedChat?._id)===chat._id?"#6F6F6F" : "#E8E8E8"}
          color={ selectedChat?._id === chat._id ? "white" : "Black"}
          >
            <Box>
            <Text >{!chat.isGroupChat ? Other(loggedUser,chat.users) : chat.chatName }
           </Text>
           {chat.latestMessage ? <Text fontSize='sm'>{!chat.isGroupChat ? chat.latestMessage.content :  (chat.latestMessage.sender.name===user.name) ? 'You : '+chat.latestMessage.content : chat.latestMessage.sender.name+" : "+chat.latestMessage.content   } </Text>:<></>}
           </Box>
           { b>0  && selectedChat?._id !==chat?._id &&  <Box borderRadius="100%" w='30px'  h="30px" py="2px" textAlign="center"  backgroundColor="#25D366" color="white" fontSize="15px">{ b }</Box>}
          </Box>
      
       
        )})
      }
     
    </Stack>
) :(<Skeletoncompo /> )} 
  </Box>

</Box>
  )
}

export default Chats