import React, { useState } from "react"
import { styled } from "styled-components"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth"
import { Form, Error, Input, Switcher, Title, Wrapper } from "../components/auth-components"
import GithubComponent from "../components/github-component"


const ForgotPasswd = styled.button`
  width: 100%;
  border-radius: 50px;
  padding: 10px 20px;
  margin-top: 20px;
  border: 0;
  font-size: 16px;
  font-weight: 500;
  transition: .3s;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
`


export default function Login() {
  const navigate = useNavigate()
  const [isLoding, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setError('') //error 초기화
    if(isLoding || email ==='' || password ==='')return; //이메일 패스워드 값없으면 함수 종료
    try{
      setIsLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    }catch(e){
      if(e instanceof FirebaseError){
        setError(e.message)
       
      }
    }finally{setIsLoading(false)}

  }

  const resetPasswd = async ()=>{
    try{
     await sendPasswordResetEmail(auth,email)
     alert('이메일에서 패스워드 초기화를 할 수 있습니다.')

    }catch(e){
      console.log(e)
    }
  }

  return (
    <>
      <Wrapper>
        <Title>Log In X</Title>
        <Form onSubmit={onSubmit}>
          <Input name="email" value={email} placeholder="Email" type="email" required onChange={onChange}></Input>
          <Input name="password" value={password} placeholder="Password" type="password" required onChange={onChange}></Input>
          <Input type="submit" value={isLoding ? "Loading...":"Log in"}></Input>
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>계정이 없으신가요?<Link to='/create-account'>회원가입하기 &rarr;</Link></Switcher>
        <ForgotPasswd onClick={resetPasswd}>비밀번호를 잊으셨나요?</ForgotPasswd>
        <GithubComponent></GithubComponent>
      </Wrapper>
    </>
  )
}
