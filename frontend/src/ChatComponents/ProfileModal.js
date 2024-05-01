import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure,Image ,Text} from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
  return (
<>

{children ?<span onClick={onOpen}> {children}</span> : <IconButton display="flex" icon={<ViewIcon/>} onClick={onOpen}/>}

 <Modal isOpen={isOpen} onClose={onClose}  isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontFamily={"work sans"} display="flex" justifyContent="center" >{user.name}</ModalHeader>
         <ModalCloseButton/>
          <ModalBody display="flex" flexDirection="column" alignItems="center" py="20px" >
         <Image src={user.pic} alt={user.name} borderRadius="100%"  boxSize='150px' />
         <Text  py="20px" fontFamily="work sans" fontSize="2xl">Email: {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>


</>
  )
}

export default ProfileModal