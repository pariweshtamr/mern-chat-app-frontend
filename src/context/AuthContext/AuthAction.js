export const LoginStart = () => ({
  type: "LOGIN_START",
})

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
})
export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload: error,
})

export const LogoutSuccess = () => ({
  type: "LOGOUT_SUCCESS",
})

export const RegisterStart = () => ({
  type: "REGISTER_START",
})

export const RegisterSuccess = (user) => ({
  type: "REGISTER_SUCCESS",
  payload: user,
})
export const RegisterFailure = (error) => ({
  type: "REGISTER_FAILURE",
  payload: error,
})
