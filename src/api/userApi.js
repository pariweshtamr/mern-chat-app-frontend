import axios from "axios"
const rootUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ROOT_URL
    : "http://localhost:8000/api/v1"

const userEp = rootUrl + "/user"

export const setAvatar = async (_id, image) => {
  try {
    const { data } = await axios.patch(`${userEp}/${_id}`, image)
    return data
  } catch (error) {
    return error.response.data
  }
}

export const getAllUsers = async (_id) => {
  try {
    const { data } = await axios.get(userEp + `/all/${_id}`)
    return data
  } catch (error) {
    return error.response.data
  }
}

export const getSearchedUsers = async (obj) => {
  const { search, token } = obj
  try {
    const { data } = await axios.get(
      `http://localhost:8000/api/v1/user?search=${search}`,
      {
        headers: { Authorization: token },
      }
    )
    return data
  } catch (error) {
    return error.response.data
  }
}
