import React, { useEffect, useState } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isAvatar, isLeftMargin, isMargin } from '../Chatslogic/Other'
import { Chatstate } from '../Context/Contextprovider'
import { Avatar, Box, Tooltip ,Text} from '@chakra-ui/react'



const Chat = ({messages}) => {
  const {user,selectedChat}=Chatstate()
  const[flag,setFlag]=useState(0)

useEffect(()=>{
  setFlag(1)

},[messages])
useEffect(()=>{
setFlag(0)
},[selectedChat._id]

)
console.log(flag)
console.log(selectedChat.notification[user._id])
  return (
   
    <ScrollableFeed>
        {messages.map((m,i)=>
       {
       
        return(

       <div>
                {(flag ===0 )  && ((!selectedChat.notification[user._id] && i===0) || ( Number( selectedChat.notification[user._id])+1 === i && messages[messages.length-1].sender._id!==user._id )  )   && <p style={{margin:'5px auto', display:'block', backgroundColor:'#E8E8E8',padding:'5px', textAlign:'center', width:'150px',borderRadius:'10px'}}>{Number(selectedChat.notification[user._id])?(selectedChat.latestMessageIndex-Number(selectedChat.notification[user._id])):(selectedChat.latestMessageIndex+1)} New Message</p>  }
       <div style={{display:'flex'}} key={m?._id} > 
     

        {isAvatar(messages,m,i,user._id) && <Tooltip label={m.sender?.name}  placement='bottom-start' hasArrow >
          <Avatar style={{marginTop:isMargin(messages,m,i,user._id)?"10px" :"2px"}} src={m.sender?.pic}  name={m.sender?.name} size="sm" cursor="pointer" mr="2px"  /></Tooltip>}
          <span style={{backgroundColor:(m.sender?._id===user._id) ?"#BEE3F8":"#B9F5D0", marginTop: (isMargin(messages,m,i,user._id))?"10px":"2px",
           padding:"5px 15px", borderRadius:"10px", maxWidth:"75%" , marginLeft:isLeftMargin(messages,m,i,user._id) }}>{m.content}</span>

        </div>
     
           </div>)
           
             
          })}
       </ScrollableFeed> 
      
  )
 
}

export default Chat