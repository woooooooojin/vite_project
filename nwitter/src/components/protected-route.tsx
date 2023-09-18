import { Navigate } from "react-router-dom"
import { auth } from "../firebase"

export default function ProtectedRoute({children}:{children:React.ReactNode}) {

    const user = auth.currentUser //로그인된 유저값을 넘기거나 null을 넘김
    console.log(user)
    if(user === null){
       return <Navigate to ='/login' />
    }

  return children
}
