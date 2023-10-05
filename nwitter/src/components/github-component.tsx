import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { styled } from "styled-components"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

const Button = styled.span`
    width: 100%;
    background-color: #fff;
    font-weight: 500;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    color: black;
    margin-top: 50px;
    cursor: pointer;
`
const Logo = styled.img`
    height: 25px;
`
export default function GithubComponent() {
    const navigate = useNavigate();
    const loginGithub = async ()=>{
        
        try{
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider)
            navigate('/')
        }catch(e){
            console.log(e)
        }

    }
  return (
    <>
        <Button onClick={loginGithub}>
            <Logo src='/github-logo.svg' />
            Continue With Github

        </Button>
    </>
  )
}
