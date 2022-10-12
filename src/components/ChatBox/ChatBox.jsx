import { Box } from "@chakra-ui/react"
import { ChatState } from "../../context/ChatContext"
import SingleChat from "../SingleChat/SingleChat"

const ChatBox = () => {
  const { selectedChat } = ChatState()

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "72%" }}
      borderRadius="lg"
      borderWidth="1px"
      ml={3}
    >
      <SingleChat />
    </Box>
  )
}

export default ChatBox
