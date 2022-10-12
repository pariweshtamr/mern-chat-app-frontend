import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "bootstrap/dist/css/bootstrap.min.css"
import App from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import { ChatProvider } from "./context/ChatContext"
import { BrowserRouter as Router } from "react-router-dom"
import { AuthContextProvider } from "./context/AuthContext/AuthContext"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <Router>
        <AuthContextProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </AuthContextProvider>
      </Router>
    </ChakraProvider>
  </React.StrictMode>
)
