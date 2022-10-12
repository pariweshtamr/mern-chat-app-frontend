import { HomeStyles } from "./homeStyles"
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Box,
} from "@chakra-ui/react"
import Login from "../login/Login"
import Register from "../register/Register"
import logo from "../../assets/logo.png"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { useEffect } from "react"
import { AuthContext } from "../../context/AuthContext/AuthContext"

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) {
      navigate("/chats")
    }
  }, [navigate])

  return (
    <HomeStyles>
      <Container maxW="xl" centerContent>
        <Box
          bg="#f6f6f6"
          w="100%"
          p={4}
          borderRadius="lg"
          m="160px auto 15px auto"
        >
          <div className="brand">
            <img className="logoImg" src={logo} alt="logo" />
            <h1 className="logoText">
              Chat <span>App</span>
            </h1>
          </div>
          <Tabs variant="soft-rounded">
            <TabList>
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Register />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </HomeStyles>
  )
}

export default Home
