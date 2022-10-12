import axios from "axios"
const rootUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_ROOT_URL
    : "http://localhost:8000/api/v1"

const authEp = rootUrl + "/auth"

export const registerUser = async (newUser, dispatch) => {
  dispatch({ type: "REGISTER_START" })
  try {
    const { data } = await axios.post(authEp + "/register", newUser)
    dispatch({ type: "REGISTER_SUCCESS", payload: data })
    return {
      status: data.status,
      message: data.message,
      data,
    }
  } catch (error) {
    dispatch({ type: "REGISTER_FAILURE", payload: error })
    return {
      status: "error",
      message: "Unable to register! Please try again later...",
    }
  }
}

export const loginUser = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" })
  try {
    const { data } = await axios.post(authEp + "/login", userCredentials)
    if (data.status === "success") {
      dispatch({ type: "LOGIN_SUCCESS", payload: data })
      return {
        status: data.status,
        data,
      }
    }
  } catch (err) {
    return {
      status: "error",
      message: "Invalid login details",
    }
  }
}

export const logoutUser = async (dispatch) => {
  localStorage.removeItem("userInfo")
  dispatch({ type: "LOGOUT_SUCCESS", payload: {} })
}
