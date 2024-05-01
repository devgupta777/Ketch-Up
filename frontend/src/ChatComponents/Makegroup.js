import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Chatstate } from '../Context/Contextprovider'
import axios from 'axios'
import Listuser from '../UserComponents/Listuser'
import { CloseButton } from '@chakra-ui/react' 


const Makegroup = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState()
    const [users,setUsers]=useState([])
    const [search,setSearch]=useState()
    const [searchResult,setSearchResult]=useState()
    const [loading,setLoading]=useState(false)
    const [loading2,setLoading2]=useState()
    const toast =useToast()

    const {user,chats,setChats}=Chatstate()

    const handleFunction=(usertobeadded)=>{

      if(users.find((u)=>u._id===usertobeadded._id))
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
      setUsers([...users,usertobeadded])
      
      }
      const handleSubmit=async()=>{
        setLoading2(true)
      
        try{
         
          const config={
            headers:
            {
              "content-type":"application/json",
              Authorization:`Bearer ${user.token}`

            }
          }
          const {data}=await axios.post('/api/chat/group',{
           name: groupChatName,
            users:JSON.stringify(users.map((u)=>u._id)),
            
          },config)
          setChats([data,...chats])
          toast({
            title: 'Group successfully created',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position:'top'
          });
          setLoading2(false)


        }
        catch(err)
        {
          toast({
            title: "Group Couldn't be created",
            status: 'error',
            duration: 2000,
            isClosable: true,
            position:'top',
            description:err.response.data.message
          });
          setLoading2(false)

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
    const handleDelete=(usertobeDeleted)=>{
      setUsers(users.filter((user)=>user._id!==usertobeDeleted._id))


    }
   

  return (
    <Box>
    <Tooltip label="Create Group" hasArrow placement='bottom' ><span onClick={onOpen}>{children}</span></Tooltip>

    <Modal isOpen={isOpen} onClose={onClose} >
      <ModalOverlay  />
      <ModalContent>
        <ModalHeader display="flex" fontSize="2xl" fontFamily="work sans" justifyContent="center">Create Group Chat</ModalHeader>
        <ModalCloseButton/>
    
        <ModalBody display="flex" flexDirection="column" alignItems="center" p="3" >
          <FormControl p="2">
            <Input placeholder="Enter Group Name" value={groupChatName} onChange={(e)=>setGroupChatName(e.target.value)}/>
          </FormControl>
          <FormControl p="2">
            <Input placeholder="Enter user to be added" value={search} onChange={(e)=>handleSearch(e.target.value)}/>
         
          </FormControl>
       <Box display="flex" flexWrap="wrap" w="100%"  m="3px" alignItems="center"   >
          {users?.map(user=>
         
            <Button borderRadius="2xl" key={user._id} fontFamily="work sans" rightIcon={<CloseButton/>} colorScheme='green' my="3px" ml="3px" fontSize="1xl" onClick={()=>handleDelete(user)}> {user.name} </Button>
             )}
             </Box>
           
          <Box display="flex" flexWrap="wrap" w="100%"  m="3px" alignItems="center" h="300px" overflowY="scroll">
          {  (loading ? <Spinner size="sm" /> : (searchResult?.map(user=><Listuser key={user._id} user={user} handleFunction={handleFunction}/>)))}
          </Box>
        </ModalBody  >

        <ModalFooter justifyContent="center">
          <Button colorScheme='blue'  onClick={handleSubmit} isLoading={loading2}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Box>
  )
}

export default Makegroup