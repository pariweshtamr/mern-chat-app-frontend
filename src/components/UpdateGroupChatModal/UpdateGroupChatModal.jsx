import { ViewIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import {
  addUserToExistingGroup,
  removeUserFromExistingGroup,
  renameGroupChat,
} from "../../api/chatApi"
import { getSearchedUsers } from "../../api/userApi"
import { AuthContext } from "../../context/AuthContext/AuthContext"
import { ChatState } from "../../context/ChatContext"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import UserListItem from "../UserAvatar/UserListItem"

const UpdateGroupChatModal = ({ fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState("")
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const { selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState()
  const { user } = useContext(AuthContext)
  const { token } = user
  const toast = useToast()

  const handleRename = async () => {
    if (!groupChatName) {
      return
    }
    try {
      setRenameLoading(true)
      const data = await renameGroupChat(
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        token
      )
      if (data._id) {
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRenameLoading(false)
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        position: "bottom",
      })
      setRenameLoading(false)
    }
    setGroupChatName("")
  }

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
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

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: "User is already in the group!",
        status: "warning",
        duration: 3000,
        position: "top",
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user.user._id) {
      toast({
        title: "Only admin can add or remove someone from the group!",
        status: "error",
        duration: 3000,
        position: "bottom",
      })
      return
    }

    try {
      setLoading(true)
      const data = await addUserToExistingGroup(
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        token
      )
      if (data._id) {
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading(false)
      }
    } catch (error) {
      toast({
        title: "Failed to add user to Group Chat!",
        status: "error",
        description: error.response.data,
        duration: 3000,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  const handleRemove = async (userToRemove) => {
    if (selectedChat?.groupAdmin._id !== user?.user?._id) {
      toast({
        title: "Only admin can add or remove someone from the group!",
        status: "error",
        duration: 3000,
        position: "bottom",
      })
      return
    }

    try {
      setLoading(true)
      const data = await removeUserFromExistingGroup(
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        token
      )

      userToRemove._id === user?.user._id
        ? setSelectedChat()
        : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      toast({
        title: "Failed to remove user from Group Chat!",
        status: "error",
        description: error.response.data,
        duration: 3000,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName.toUpperCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to the group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  foreignUser={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user.user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
