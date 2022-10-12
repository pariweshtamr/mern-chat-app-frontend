import { Box } from "@chakra-ui/react"
import { ChatState } from "../../context/ChatContext"
import { UserListItemStyles } from "./UserListItemStyles"

const UserListItem = ({ foreignUser, handleFunction }) => {
  return (
    <UserListItemStyles>
      <div className="userChat" onClick={handleFunction}>
        <img src={foreignUser.avatarImage} alt="" />
        <div className="userChatInfo">
          <span>{foreignUser.displayName}</span>
          <p>{foreignUser.email}</p>
        </div>
      </div>
    </UserListItemStyles>
  )
}

export default UserListItem
