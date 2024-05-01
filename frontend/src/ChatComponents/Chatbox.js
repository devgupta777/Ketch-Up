import React from 'react'
import { Chatstate } from '../Context/Contextprovider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'


const Chatbox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} =Chatstate()

  return (
    <Box display={{base: selectedChat? "flex" : "none" , md :"flex"}} flexDirection="column" alignItems="center"  p="3" bgColor="white"
    borderWidth="1px" borderRadius="lg" w={{base: "100%",md:"69%"}}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default Chatbox