import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, CloseButton, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Chatstate } from '../Context/Contextprovider'
import Listuser from '../UserComponents/Listuser'
import axios from 'axios'

const UpdateGroupChatModel = ({fetchAgain,setFetchAgain,fetchMessage}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,selectedChat,setSelectedChat}=Chatstate()
    const [groupChatName,setGroupChatName]=useState()
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const [loading2,setLoading2]=useState(false)
    const [loading3,setLoading3]=useState(false)
    const [loading4,setLoading4]=useState(false)
    const [loading5,setLoading5]=useState(false)


    const toast=useToast()

    const handleDelete=async(usertoberemoved)=>{

  if(user._id!==selectedChat.groupAdmin._id)
      {
        toast({
          title: ' Only Admin can remove users',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:'top'
          
        });
        return; 
      }
      try{
   setLoading3(true)
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const {data}=await axios.put('/api/chat/remove',{
          chatId:selectedChat._id,
          userId:usertoberemoved._id

        },config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        fetchMessage();
     setLoading3(false)
      }
      catch(err)
      {
        toast({
          title: "User couldn't be removed",
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:'top'
          
        });
       
setLoading3(false)
      }



    }
    const handleDeleteyou=async(usertoberemoved)=>{

    
          try{
            setLoading5(false)
       
            const config={
              headers:{
                Authorization:`Bearer ${user.token}`
              }
            }
            const {data}=await axios.put('/api/chat/remove',{
              chatId:selectedChat._id,
              userId:usertoberemoved._id
    
            },config)
           user._id ===usertoberemoved._id?setSelectedChat(): setSelectedChat(data)
            setFetchAgain(!fetchAgain)
         setLoading5(true)
          }
          catch(err)
          {
            toast({
              title: "User couldn't be removed",
              status: 'warning',
              duration: 2000,
              isClosable: true,
              position:'top'
              
            });
           setLoading5(false)
    
          }
    
    
    
        }
    const renameGroup=async(namename)=>{
      if(user._id!==selectedChat.groupAdmin._id)
      {
        toast({
          title: ' Only Admin can rename group',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:'top'
          
        });
        return; 
      }
      
       try{
        setLoading2(true)
        const config={
            headers:
            {
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.put('/api/chat/rename',{
            chatId:selectedChat._id,
            newname:groupChatName
        },config)
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading2(false)
        setGroupChatName("")

       }
       catch(err)
       {
          toast({
        title: "Couldn't Rename Group",
        status: 'error',
        duration: 2000,
        isClosable: true,
        position:'bottom',
        description:err.response.data.message
          })


       }


    }
    const addToGroup=async(usertobeadded)=>{
      if(user._id!==selectedChat.groupAdmin._id)
      {
        toast({
          title: ' Only Admin can add users',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:'top'
          
        });
        return; 
      }
        if(selectedChat.users.find((u)=>u._id===usertobeadded._id))
        {
          toast({
            title: ' User already exist',
            status: 'warning',
            duration: 2000,
            isClosable: true,
            position:'top'
            
          });
          return;
        }
        try{
          setLoading4(true)
           
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put('/api/chat/add',{
                chatId:selectedChat._id,
                userId:usertobeadded._id

            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
          
     setLoading4(false)

        }
        catch(err)
        {
            toast({
                title: "User Couldn't be added",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:'bottom',
                description:err.response.data.message
                  })
          
             setLoading4(false)   
        }



    }
    const handleSearch=async(query)=>{
        setSearch(query)
     
        if(!query)
        {
          setSearchResult([])
          return
        }
        try{
          setLoading(true)
          const config=
          {
            headers:{
              Authorization:`Bearer ${user.token}`
      
            }
          };
          const {data}= await axios.get(`/api/user?search=${query}`,config)
          console.log(data);
          setSearchResult(data);
          setLoading(false);
       return
      
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

  return (
    <>
<IconButton icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered borderRadius="lg" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontFamily="work sans" display="flex" justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box display="flex"  w="100%" flexDirection="column" alignItems="center" justifyContent="center" >
          <Box display="flex" flexWrap="wrap" w="100%"  m="3px" alignItems="center"  >
          {selectedChat.users?.map(u=>
            (u._id !== user._id)?
           <Button size="sm" borderRadius="2xl" key={u._id} fontFamily="work sans" rightIcon={<CloseButton/>} colorScheme='green' my="3px" ml="3px" fontSize="15px" onClick={()=>handleDelete(u)}> {u.name} </Button> :<></>)
           } 
             </Box>
             {  loading3 ? <Spinner size="sm" m="3" />:<></>}
           <Box w="100%" display="flex" p="2xl" >
         <Input placeholder="Enter Group's New Name" value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)} m="1" />
         <Button variant="solid" colorScheme='blue' onClick={()=>renameGroup(groupChatName)  } m="1" isLoading={loading2}>Rename</Button>
     
                </Box>

           <Input placeholder='search User' value={search}  onChange={(e)=>handleSearch(e.target.value)} m="3" />
         
           {  (loading ? <Spinner size="sm" /> : (searchResult?.slice(0,4).map(user=><Listuser key={user._id} user={user} handleFunction={addToGroup}/>)))}
           {  loading4 ? <Spinner size="sm" m="3" />:<></>}

          </Box>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button colorScheme='red' mr={3} onClick={()=>handleDeleteyou(user)} isLoading={loading5}>
              Leave Group
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModel