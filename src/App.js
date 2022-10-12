import { useEffect } from "react"
import { useContext } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext/AuthContext"
import Chat from "./pages/Chat/Chat"
import Home from "./pages/home/Home"

function App() {
  const { user, isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
  }, [])

  return (
    <Routes>
      <Route path="/" exact element={<Home />}></Route>
      <Route path="/chats" element={<Chat />}></Route>
    </Routes>
  )
}

export default App
