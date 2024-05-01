import React, { useState } from 'react'
import { Chatstate } from '../Context/Contextprovider';
import Sidedrawer from '../ChatComponents/Sidedrawer';
import { Box } from '@chakra-ui/react';
import Chats from '../ChatComponents/Chats';
import Chatbox from '../ChatComponents/Chatbox';

 

const ChatPage = () => {
  const {user}=Chatstate();
  const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <div style={{width:"100%"}} >
      {user && <Sidedrawer/> }
      <Box display="flex" justifyContent="space-between" w="100%" h="91vh" p="10px"   >
        {user && <Chats fetchAgain={fetchAgain} />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}   />}
      </Box>
      

     </div>
  )
}

export default ChatPage;