import { ChatState } from "../../context/ChatContext"
import { ArrowBackIcon } from "@chakra-ui/icons"
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import React, { useContext } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { fetchChatMessages, sendNewMessage } from "../../api/messageApi"
import { getSender, getSenderFull } from "../../config/ChatLogic"
import ProfileModal from "../ProfileModal/ProfileModal"
import ScrollableChat from "../ScrollableChat/ScrollableChat"
import UpdateGroupChatModal from "../UpdateGroupChatModal/UpdateGroupChatModal"
import { io } from "socket.io-client"
import { useRef } from "react"
import { AuthContext } from "../../context/AuthContext/AuthContext"
import animationData from "../../assets/typing.json"

const ENDPOINT =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ENDPOINT_URL
    : "http://localhost:8000"

const SingleChat = () => {
  const { user } = useContext(AuthContext)
  const {
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  } = ChatState()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState()
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast()
  const socket = useRef()

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // }

  const fetchMessages = async () => {
    if (!selectedChat) return
    try {
      setLoading(true)
      const data = await fetchChatMessages(selectedChat._id, user?.token)
      setMessages(data)
      setLoading(false)
      socket.current?.emit("join chat", selectedChat._id)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "bottom",
      })
    }
  }

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.current?.emit("stop typing", selectedChat._id)
      try {
        setNewMessage("")
        const data = await sendNewMessage(
          { chatId: selectedChat._id, message: newMessage },
          user.token
        )
        socket.current?.emit("new message", data)
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send message!",
          status: "error",
          duration: 3000,
          position: "bottom",
        })
      }
    }
  }

  useEffect(() => {
    socket.current = io(ENDPOINT)
    socket.current?.emit("setup", user?.user)
    socket.current?.on("connected", () => setSocketConnected(true))
    socket.current?.on("typing", () => setIsTyping(true))
    socket.current?.on("stop typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [selectedChat])

  useEffect(() => {
    socket.current?.on("message received", (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        //give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification])
          // setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    // typing indicator logic
    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.current?.emit("typing", selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    var timerLength = 5000

    setTimeout(() => {
      const timeNow = new Date().getTime()
      const timeDifference = timeNow - lastTypingTime

      if (timeDifference >= timerLength && typing) {
        socket.current?.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchMessages={fetchMessages} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="transparent"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? <div className="">Typing...</div> : <></>}
              <Input
                placeholder="Enter a message..."
                variant="filled"
                bg="transparent"
                border="1px"
                borderColor="#2679bc"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting...
          </Text>
        </Box>
      )}
    </>
  )
}

export default SingleChat
