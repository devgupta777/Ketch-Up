import React from 'react'
import {VStack} from '@chakra-ui/layout'
import {Button, FormControl,FormLabel, Input, InputGroup, InputRightElement} from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useNavigate} from "react-router-dom";

const Login = () => {

  const [email,setEmail]=useState('')
  const [password,setPassword] =useState()
  const[show,setShow]=useState('Show')
  const [loading,setLoading]=useState(false)
  const toast = useToast()
  const navigate=useNavigate();
  const submitHandler=async()=>{
    if(!email || !password)
    {
      toast({
        title: 'Fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      });
      setLoading(false)
      return;
    }
  try{
    const config={
      Headers:{
        "content-type":"application/json"
      }
    }
    const {data}=await axios.post("/api/user/login",{email,password},config)
    setLoading(false)
    localStorage.setItem("Info",JSON.stringify(data))
   
    navigate("/chats")
  
    toast({
      title: 'User successfully loged in',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position:'top'
    });
   
  }
  catch(err)
  {
    toast({
      title: 'Request not completed',
      status: 'error',
      duration: 5000,
      isClosable: true,
      description:err.response.data.message,
      position:'bottom'
    });
    setLoading(false)
  }
}


  return (
   <VStack spacing='5px' my='10px'>
    <FormControl isRequired>
      <FormLabel >Email-Address</FormLabel>
      <Input placeholder=' Email' onChange={(e)=>setEmail(e.target.value)} value={email}></Input>

    </FormControl>
    <FormControl isRequired>
      <FormLabel >Password</FormLabel>
      <InputGroup>
      <Input type={(show==='Show'?'password':'text')} placeholder='Password' onChange={(e)=>setPassword(e.target.value)} value={password}></Input>
      <InputRightElement w='4.5rem'  >
      <Button  size={'sm'} h='30px' w='4rem'  colorScheme='blue'  onClick={()=>{(show==='Show')?setShow('Hide'): setShow('Show')}}>
        {show }
      </Button>
      </InputRightElement>
      </InputGroup>
      

    </FormControl>
   
   
    <Button  colorScheme='blue'  width='100%' fontSize={'20px'} mt='1' onClick={submitHandler} isLoading={loading}>
      Login
    </Button>
    {/* <Button  colorScheme='red'  width='100%' fontSize={'20px'} mt='1' onClick={()=>{
      setEmail("guest@gmail.com")
      setPassword("1234")
    }}>
      Get Guest User Credentials
    </Button> */}

   </VStack>
  )
}



export default Login