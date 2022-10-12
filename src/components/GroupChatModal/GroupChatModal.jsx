import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { createGroupChat } from "../../api/chatApi"
import { getSearchedUsers } from "../../api/userApi"
import { AuthContext } from "../../context/AuthContext/AuthContext"
import { ChatState } from "../../context/ChatContext"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import UserListItem from "../UserAvatar/UserListItem"

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { user } = useContext(AuthContext)
  const { chats, setChats } = ChatState()
  const { token } = user

  const { isOpen, onOpen, onClose } = useDisclosure()

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
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User is already in the group!",
        status: "warning",
        duration: 3000,
        position: "top",
      })
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const handleDelete = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToDelete._id))
  }

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields!",
        status: "warning",
        duration: 3000,
        position: "top",
      })
      return
    }
    try {
      const data = await createGroupChat(
        {
          chatName: groupChatName,
          users: selectedUsers?.map((u) => u._id),
        },
        token
      )
      if (data._id) {
        setChats([data, ...chats])
      }
      onClose()
      toast({
        title: "New Group Chat create!",
        status: "success",
        duration: 3000,
        position: "bottom",
      })
    } catch (error) {
      toast({
        title: "Failed to create Group Chat!",
        status: "error",
        description: error.response.data,
        duration: 3000,
        position: "bottom",
      })
    }
  }

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="5"
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={1}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users to the group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box display="flex" flexWrap="wrap" w="100%">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    foreignUser={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
            {/* render searched user */}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default GroupChatModal
