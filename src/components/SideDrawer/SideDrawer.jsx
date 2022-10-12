import {
  Box,
  Button,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { BsSearch } from "react-icons/bs"
import { useContext, useState } from "react"
import ProfileModal from "../ProfileModal/ProfileModal"
import { ChatState } from "../../context/ChatContext"
import { useNavigate } from "react-router-dom"
import { SideDrawerStyles } from "./SideDrawerStyles"
import { getSearchedUsers } from "../../api/userApi"
import UserListItem from "../UserAvatar/UserListItem"
import { createChat } from "../../api/chatApi"
import ChatLoading from "../ChatLoading/ChatLoading"
import { AuthContext } from "../../context/AuthContext/AuthContext"
import { getSender } from "../../config/ChatLogic"
import { BadgedButton } from "@react-md/badge"
import { logoutUser } from "../../api/authApi"

const SideDrawer = () => {
  const { user, dispatch } = useContext(AuthContext)
  const { setSelectedChat, chats, setChats, notification, setNotification } =
    ChatState()
  const { token } = user
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const toast = useToast()

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 3000,
        position: "top-left",
      })
      return
    }
    try {
      setLoading(true)
      const { users } = await getSearchedUsers({ search, token })

      setLoading(false)
      setSearchResult(users)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load search results",
        status: "error",
        duration: 3000,
        position: "top-left",
      })
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const data = await createChat({ userId, token })
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        position: "top-left",
      })
    }
  }

  const logoutHandler = () => {
    logoutUser(dispatch)
    navigate("/")
  }
  return (
    <SideDrawerStyles>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Search Users to start chatting..."
          hasArrow
          placement="bottom-end"
        >
          <Button variant="ghost" onClick={onOpen}>
            <BsSearch />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Chat-App</Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BadgedButton id="notifications">
                {notification?.length}
              </BadgedButton>

              <BellIcon mr={2} fontSize="2xl" color="gold" />
            </MenuButton>
            <MenuList px={2}>
              {!notification.length && "No new messages"}
              {notification.map((n) => (
                <MenuItem
                  key={n._id}
                  onClick={() => {
                    setSelectedChat(n.chat)
                    setNotification(notification.filter((notif) => notif !== n))
                  }}
                >
                  {n.chat.isGroupChat
                    ? `New message in ${n.chat.chatName}`
                    : `New message from ${getSender(user, n.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name="" src="" />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user.user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                className="searchInput"
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  foreignUser={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </SideDrawerStyles>
  )
}

export default SideDrawer
