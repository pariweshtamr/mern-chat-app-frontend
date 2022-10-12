import { useState } from "react"
import { useEffect } from "react"
import { createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState()
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [fetchAgain, setFetchAgain] = useState(false)
  const [notification, setNotification] = useState([])

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => {
  return useContext(ChatContext)
}
