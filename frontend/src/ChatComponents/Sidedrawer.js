import { Box, Button, Tooltip,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, useToast, Skeleton, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react'
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import { Chatstate } from '../Context/Contextprovider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Skeletoncompo from './Skeletoncompo';
import Listuser from '../UserComponents/Listuser';




const Sidedrawer = () => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([])
  const [loading,setLoading]=useState(false)
  const [loading2,setLoading2]=useState(false)

  const {user,setSelectedChat,chats,setChats,selectedChat}=Chatstate();
  const navigate =useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const Logout=()=>{
    localStorage.removeItem("Info");
    navigate('/')

  }
  const toast=useToast();
  const handleClick=async()=>{
    if(!search)
    {
      toast({
        title: 'Enter something in search',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position:'top'
      });
      return;

    }
  
    try{
      setLoading(true)
      const config=
      {
        headers:{
          Authorization:`Bearer ${user.token}`
  
        }
      };
      const {data}= await axios.get(`/api/user?search=${search}`,config)
      setSearchResult(data);
      setLoading(false);

    }
    catch(err)
    {
      toast({
        title: ' Request not complete',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position:'bottom',
        description:err.response.data.message
        
      });
    }
  }
  const accessChats=async(userId)=>{
    try{
      setLoading2(true)
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}=await axios.post('/api/chat',{userId},config)
       setSelectedChat(data);
      if(!chats.find(c=>c._id===data._id))
      {
      setChats([data,...chats]);
      
      }
     
      setLoading2(false)

      onClose();
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
        
      });
    }
   

  }
  return (
   <>
   <Box display="flex" justifyContent="space-between" alignItems="center" w="100%" bg="white" px="10px" py="5px" borderWidth="5px">
    <Tooltip label="search user to chat" hasArrow placement='bottom'>
      <Button variant="solid" onClick={onOpen} >
      <i class="fas fa-search"></i>
      <Text display={{base:"none",md:"flex"}} px="4">search user</Text>
      </Button>
    </Tooltip>
    <Text fontSize="2xl" fontFamily={"work sans"}>Catch-Up</Text>
    <Box>
    
      <Menu>
      
      <MenuButton py="1" paddingLeft="3" _hover={{ bg: '#ebedf0' }}  borderRadius='5px'  >
  
        <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
       <ChevronDownIcon fontSize="2xl" m="1" />
        </MenuButton >
      
        <MenuList>
          <ProfileModal user={user}>
          <MenuItem>Profile</MenuItem>
          </ProfileModal>
          <MenuDivider/>
          <MenuItem onClick={Logout}>LogOut</MenuItem>
        </MenuList>
      </Menu>


    </Box>
   </Box>
   <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader display="flex" justifyContent="center" borderBottomWidth="1px"><Text fontFamily={"work sans"} fontSize="2xl">Search User</Text></DrawerHeader>

          <DrawerBody>
           <Box display="flex" py={2}>
            <Input mr="2" placeholder='Search by name or email' value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e)=>{
              if(e.key==='Enter')
              handleClick()
          }} />
            <Button onClick={handleClick} >Go</Button>
           </Box>
           {loading ? <Skeletoncompo/>:(searchResult?.map(user=><Listuser key={user._id} user={user} handleFunction={()=>accessChats(user._id)}/>))}
           {loading2 && <Spinner size="sm" position="fixed" top="10px" right="10px" />}
          </DrawerBody>

        
        </DrawerContent>
      </Drawer>
   </>
  )
}

export default Sidedrawer