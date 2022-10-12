import axios from "axios"
const rootUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ROOT_URL
    : "http://localhost:8000/api/v1"

const messageEp = rootUrl + "/message"

export const sendNewMessage = async ({ chatId, message }, token) => {
  try {
    const { data } = await axios.post(
      messageEp,
      { chatId, message },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    return data
  } catch (error) {
    return error.response.data
  }
}

export const fetchChatMessages = async (chatId, token) => {
  try {
    const { data } = await axios.get(`${messageEp}/${chatId}`, {
      headers: {
        Authorization: token,
      },
    })
    return data
  } catch (error) {
    return error.response.data
  }
}
