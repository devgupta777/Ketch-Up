import React from 'react'
import { Box, Container,Tab,TabList,TabPanel,TabPanels,Tabs,Text} from '@chakra-ui/react'
import Login from '../authentication/Login.js'
import Signup from '../authentication/Signup.js'
import {useNavigate} from 'react-router-dom'
import { useEffect} from 'react'
const Home = () => {
  const navigate=useNavigate();
 
  useEffect(()=>{
    
    const info=JSON.parse(localStorage.getItem("Info"));
    if(info)
    {
        navigate('/chats');
   

    }

},[navigate])

  return (
    <Container maxW="xl" centerContent  >
      <Box  display="flex" justifyContent="center" w="100%"  bgColor="white" m="30px 0 15px 0 " p="2px" border="1px " borderRadius="lg"> 
       <Text fontFamily={"work sans"} fontSize={"4xl"}  > 
        Catch-Up
       </Text>
       </Box>
       <Box   w='100%' bgColor={"white"}  p={5} pb={1} border="1px " borderRadius="lg">
       <Tabs variant='soft-rounded' colorScheme='blue' >
  <TabList > 
    <Tab w="50%" >LOGIN</Tab>
    <Tab w="50%" >SIGNUP</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
     <Login/>
    </TabPanel>
    <TabPanel>
    <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>

       </Box>


    </Container>
   
  )
}

export default Home