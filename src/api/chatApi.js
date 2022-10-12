import axios from "axios"
const rootUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ROOT_URL
    : "http://localhost:8000/api/v1"

const chatEp = rootUrl + "/chat"

export const createChat = async (obj) => {
  const { userId, token } = obj
  try {
    const { data } = await axios.post(
      chatEp,
      { userId },
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

export const fetchUserChats = async (token) => {
  try {
    const { data } = await axios.get(chatEp, {
      headers: {
        Authorization: token,
      },
    })
    return data
  } catch (error) {
    return error.response.data
  }
}

export const createGroupChat = async (obj, token) => {
  try {
    const { data } = await axios.post(chatEp + "/group", obj, {
      headers: {
        Authorization: token,
      },
    })
    return data
  } catch (error) {
    return error.response.data
  }
}

export const renameGroupChat = async (obj, token) => {
  try {
    const { data } = await axios.put(chatEp + "/group", obj, {
      headers: {
        Authorization: token,
      },
    })
    return data
  } catch (error) {
    return error.response.data
  }
}

export const addUserToExistingGroup = async (obj, token) => {
  try {
    const { data } = await axios.put(chatEp + "/groupAdd", obj, {
      headers: {
        Authorization: token,
      },
    })
    return data
  } catch (error) {
    return error.response.data
  }
}

export const removeUserFromExistingGroup = async (obj, token) => {
  try {
    const { data } = await axios.put(chatEp + "/groupRemove", obj, {
      headers: {
        Authorization: token,
      },
    })
    console.log(data)
    return data
  } catch (error) {
    return error.response.data
  }
}
