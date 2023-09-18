import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import React, { useState } from "react"
// import { styled } from "styled-components"
import { auth } from "../firebase"
import {  Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { Error, Input, Switcher, Title, Wrapper, Form} from "../components/auth-components"
import GithubComponent from "../components/github-component"




export default function CreateAccount() {
  const navigate = useNavigate()
  const [isLoding, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  }

  const onSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setError('') //error 초기화
    if(isLoding || name === '' || email ==='' || password ==='')return;
    try{
      setIsLoading(true)
      const credentials = await createUserWithEmailAndPassword(auth, email, password)
      console.log(credentials.user)
      await updateProfile(credentials.user,{
        displayName : name,

      })
      navigate('/')
    }catch(e){
      if(e instanceof FirebaseError){
        setError(e.message)
       
      }
    }finally{setIsLoading(false)}
  }

  return (
    <>
      <Wrapper>
        <Title>Join X</Title>
        <Form onSubmit={onSubmit}>
          <Input name="name" value={name} placeholder="Name" type="text" required onChange={onChange}></Input>
          <Input name="email" value={email} placeholder="Email" type="email" required onChange={onChange}></Input>
          <Input name="password" value={password} placeholder="Password" type="password" required onChange={onChange}></Input>
          <Input type="submit" value={isLoding ? "Loading...":"Create Account"}></Input>
        </Form>
        {error !== "" ? <Error>{error}</Error> : null}
        <Switcher>이미 계정이 있으신가요?<Link to='/login'>로그인하기 &rarr;</Link></Switcher>
        <GithubComponent></GithubComponent>
      </Wrapper>
    </>
  )
}
