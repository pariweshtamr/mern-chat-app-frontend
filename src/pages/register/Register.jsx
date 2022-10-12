import React, { useContext, useState } from "react"
import { Container, useToast, Spinner } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import { FormContainer } from "./RegisterStyles"
import "react-toastify/dist/ReactToastify.css"
import addImage from "../../assets/addAvatar.png"
import { BiShow, BiHide } from "react-icons/bi"
import axios from "axios"
import { registerUser } from "../../api/authApi"
import { AuthContext } from "../../context/AuthContext/AuthContext"

const Register = () => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [file, setFile] = useState("")
  const toast = useToast()
  const { dispatch } = useContext(AuthContext)

  const postImg = async (img) => {
    try {
      setLoading(true)
      if (img) {
        const data = new FormData()
        data.append("file", img)
        data.append("upload_preset", "upload")

        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/ddbttkmhz/image/upload",
          data
        )
        const { url } = uploadRes.data
        setFile(url)
        return url
      }
      setLoading(false)
    } catch (error) {
      setError(true)
      setLoading(false)
    }
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (
      displayName === "" ||
      password === "" ||
      confirmPassword === "" ||
      email === ""
    ) {
      toast({
        status: "error",
        description: "Please enter all the required fields.",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        status: "error",
        description: "Password and confirm password must be same",
      })
    } else if (displayName.length < 3) {
      toast({
        status: "error",
        description: "Username must be longer than 3 characters",
      })
    } else if (password.length < 8) {
      toast({
        status: "error",
        description: "Password must be at least 8 characters or longer",
      })
      return
    }

    try {
      setLoading(true)
      const register = await registerUser(
        {
          displayName,
          password,
          email,
          file,
        },
        dispatch
      )

      register.status === "success" &&
        toast({
          title: register.message,
          status: "success",
        })

      // localStorage.setItem("userInfo", JSON.stringify(register))

      setLoading(false)
      setDisplayName("")
      setPassword("")
      setConfirmPassword("")
      setEmail("")
      setFile("")
    } catch (error) {
      setError(true)
      toast({
        title: "Error",
        description: error.reponse.data.message,
        status: "error",
      })
      setLoading(false)
    }
  }

  return (
    <FormContainer>
      <Container maxW="xl">
        <form onSubmit={(e) => handleOnSubmit(e)}>
          <div className="form-inputs">
            <input
              type="text"
              placeholder="Display Name *"
              name="displayName"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />
            <input
              type="email"
              placeholder="Email *"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <input
              type={show ? "text" : "password"}
              placeholder="Password *"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <div className="passContainer">
              <input
                type={show ? "text" : "password"}
                placeholder="Confirm Password *"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <div className="showHidePass" onClick={() => setShow(!show)}>
                {show ? <BiShow /> : <BiHide />}
              </div>
            </div>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              onChange={(e) => postImg(e.target.files[0])}
            />
            <label htmlFor="file">
              <img src={addImage} alt="" />
              <span>Add an avatar</span>
            </label>
          </div>
          {error && <span>Something went wrong!</span>}
          <button type="submit">{loading ? <Spinner /> : "Sign Up"}</button>
          <span className="form-footer">
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </Container>
    </FormContainer>
  )
}

export default Register
