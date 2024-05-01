import {createContext, useContext, useEffect, useState} from 'react'

import {useNavigate} from 'react-router-dom'

const chatContext=createContext()

const Contextprovider=({children})=>{
   
    const [user,setUser]=useState()
    const [selectedChat,setSelectedChat]=useState()
    const [chats,setChats]=useState([])
   
    const navigate=useNavigate();
    useEffect(()=>{
    
        const info=JSON.parse(localStorage.getItem("Info"));
        setUser(info)
      
       
        if(!info)
        {
         
         navigate('/')
            
        }    
    },[navigate])
 return   <chatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,setChats,chats}}>
        {children}
   
    </chatContext.Provider>
}
export const Chatstate=()=>{
return useContext(chatContext)
}
export default Contextprovider