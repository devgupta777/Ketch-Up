import React from 'react'
import {VStack} from '@chakra-ui/layout'
import {Button, FormControl,FormLabel, Input, InputGroup, InputRightElement} from '@chakra-ui/react'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Signup = () => {
  const [name,setName] = useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword] =useState()
  const [confirmpassword,setConfirmpassword] =useState()
  const [pic,setPic]=useState()
  const[show,setShow]=useState('Show')
  const[show2,setShow2]=useState('Show')
  const [loading,setLoading]=useState(false)
  const toast = useToast()
  const navigate=useNavigate();
 
  const submitHandler=async()=>{
    if(!name || !email || !password || !confirmpassword)
    {
      toast({
        title: 'Fill all the fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:'bottom'
      });
      setLoading(false)
      return;
    }
  if(password!==confirmpassword)
  {
    toast({
      title: 'Password does not match confirmpassword',
      status: 'warning',
      duration: 3000,
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
   
    const {data}=await axios.post("/api/user",{name,email,password,pic},config)
    toast({
      title: 'User successfully registered',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position:'top'
    });
    localStorage.setItem("Info",JSON.stringify(data))
    navigate("/chats");
    setLoading(false)
  }
  catch(err)
  {
    toast({
      title: 'Request not completed',
      status: 'error',
      duration: 3000,
      isClosable: true,
      description:err.response.data.message,
      position:'bottom'
    });
    setLoading(false)
  }
}
  const post=(img)=>{
    setLoading(true)
    if(img===undefined)
    {  
      toast({
        title: 'Select an image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:'bottom'
      });
      setLoading(false)
      return;
    }
    if(img.type==='image/jpeg' || img.type==='image/png')
    {
      const data=new FormData()
      data.append("file",img)
      data.append("upload_preset","catchup")
      data.append("cloud_name","catchup")
      fetch("https://api.cloudinary.com/v1_1/catchup/image/upload",{
        method:"post",
        body:data,
      })
      .then((res)=>
      {
        return res.json()

      })
      .then((data)=>{
        setPic(data.url.toString())
        setLoading(false)
      })
      .catch(err=>{
        console.log(err)
        setLoading(false)
      })
   
 
    }
    else{
      toast({
        title: 'Select an image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:'bottom'
      });
      setLoading(false)
      return;

    }

  }

  return (
   <VStack spacing='5px' my='10px'>
    <FormControl isRequired>
      <FormLabel >Name</FormLabel>
      <Input placeholder='Name' onChange={(e)=>setName(e.target.value)} value={name}></Input>

    </FormControl>
    <FormControl isRequired>
      <FormLabel >Email</FormLabel>
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
    <FormControl isRequired>
      <FormLabel >Confirm Password</FormLabel>
      <InputGroup>
      <Input type={(show2==='Show'?'password':'text')} placeholder='Confirm Password' onChange={(e)=>setConfirmpassword(e.target.value)} value={confirmpassword}></Input>
      <InputRightElement w='4.5rem'  >
      <Button  size={'sm'} h='30px' w='4rem'  colorScheme='blue'  onClick={()=>{(show2==='Show')?setShow2('Hide'): setShow2('Show')}}>
        {show2 }
      </Button>
      </InputRightElement>
      </InputGroup>
      

    </FormControl>
    <FormControl >
      <FormLabel >Upload your Image</FormLabel>
      <Input type='file' p='1' accept='image/*' onChange={(e)=>post(e.target.files[0]) } ></Input>

    </FormControl>
    <Button  colorScheme='blue'  width='100%' fontSize={'20px'} mt='1' isLoading={loading} onClick={submitHandler}>
      Submit
    </Button>

   </VStack>
  )
}

export default Signup