import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/createAccount"
import { createGlobalStyle, styled } from "styled-components"
import reset from "styled-reset"
import { useEffect, useState } from "react"
import Loading from "./components/loading"
import { auth } from "./firebase"
import ProtectedRoute from "./components/protected-route"


const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <Home/>,
      },
      {
        path: "profile",
        element: <Profile/>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
])

const GlobalStyled = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body{
    background-color: black;
    color: #fff;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
`;

function App() {

  const [isLoading, setIsLoading] = useState(true)
  const init = async () => {
    await auth.authStateReady(); //인증상태가 준비되었는지 기다림 firebase가 쿠키와 토큰을 읽고 백엔드와 소통해서 로그인여부 확인
    setIsLoading(false)

  }
  useEffect(() => {init()},[])

  return (
    <>
    <Wrapper>
      <GlobalStyled/>
      {isLoading ? <Loading/> : <RouterProvider router={router}/>}
    </Wrapper>
    </>
  )
}

export default App
