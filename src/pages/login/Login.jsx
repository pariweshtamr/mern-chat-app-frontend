import React, { useState } from "react"
import { Container, useToast, Spinner } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { LoginContainer } from "./LoginStyles"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BiShow, BiHide } from "react-icons/bi"
import { loginUser } from "../../api/authApi"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const { isFetching, err, dispatch } = useContext(AuthContext)

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (!email || !password) {
      toast({
        status: "error",
        description: "Please enter your email and password.",
        duration: 3000,
        position: "bottom",
      })
      setLoading(false)
      return
    }
    try {
      const login = await loginUser({ email, password }, dispatch)
      setLoading(false)

      if (login.status === "success") {
        navigate("/chats")
      }

      if (login.status === "error") {
        toast({
          title: "Error Occured!",
          description: login.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <ToastContainer />
      <Container maxW="xl">
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <div className="form-inputs">
            <input
              type="text"
              placeholder="Enter Your Email *"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              min="3"
            />
            <div className="passContainer">
              <input
                type={show ? "text" : "password"}
                placeholder="Enter Your Password *"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <div className="showHidePass" onClick={() => setShow(!show)}>
                {show ? <BiShow /> : <BiHide />}
              </div>
            </div>
          </div>

          {error && <span>Something went wrong!</span>}

          <button type="submit">{loading ? <Spinner /> : "Login"}</button>
          <span className="form-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </Container>
    </LoginContainer>
  )
}

export default Login
