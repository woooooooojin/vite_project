import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home"
import Profile from "./routes/profile"
import Login from "./routes/login"
import CreateAccount from "./routes/createAccount"
import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"


const router = createBrowserRouter([
  {
    path :'/',
    element : <Layout/>,
    children : [
      {
        path:'',
        element : <Home/>
      },
      {
        path:'profile',
        element :<Profile/>
      }
     
  ]
  },

  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/create-account',
    element:<CreateAccount/>
  }
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

  return (
    <>
      <GlobalStyled/>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
