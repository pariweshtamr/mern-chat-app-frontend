export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?.user?._id
    ? users[1]?.displayName
    : users[0]?.displayName
}

export const getSenderFull = (loggedUser, users) => {
  return users[0]?._id === loggedUser?.user?._id ? users[1] : users[0]
}

export const isSameSender = (
  messages,
  currentMessage,
  indexOfCurrentMsg,
  userId
) => {
  return (
    indexOfCurrentMsg < messages.length - 1 &&
    (messages[indexOfCurrentMsg + 1].sender._id !== currentMessage.sender._id ||
      messages[indexOfCurrentMsg + 1].sender._id === undefined) &&
    messages[indexOfCurrentMsg].sender._id !== userId
  )
}

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  )
}

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id
}
