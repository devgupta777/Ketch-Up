import { Avatar,Box,Text } from '@chakra-ui/react'
import React from 'react'


const Listuser = ({user,handleFunction}) => {
  return (
    
 <Box onClick={()=>handleFunction(user)} cursor="pointer" bg= '#E8E8E8' 
 _hover={{background:"#6F6F6F",color:"white"}} w="100%" display="flex" color="black" px="1" py="2" my="2" mx="1" alignItems="center" borderRadius="xl">
<Avatar size="sm" src={user.pic} name={user.name} cursor="pointer" mr="2"/>
<Box >
    <Text>{user.name}</Text>
    <Text fontSize="xs"><b>E-mail - </b> {user.email}</Text>
</Box>

 </Box>
  )
}



export default Listuser