import { styled } from "styled-components"
import { auth, storage } from "../firebase"
import { useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"


const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;

`
const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: steelblue;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    width: 50px;
  }
`
const AvatarImg = styled.img`
  width: 100%;
`
const AvatarInput = styled.input`
  display: none;
`
const Name = styled.span`
  font-size: 22px;
`

export default function Profile() {

  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)

  const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) =>{
    const {files} = e.target
    if(!user) return;
    if(files && files.length === 1){
      const file = files[0]
      const locationRef = ref(storage, `avatars/${user?.uid}`, )
      const result = await uploadBytes(locationRef, file)
      const avatarUrl = await getDownloadURL(result.ref)
      setAvatar(avatarUrl)
      await updateProfile(user,{
        photoURL:avatarUrl,
      })
    }
  }

  return (
    <>
      <Wrapper>
        <AvatarUpload htmlFor="avatar">
          {avatar ? <AvatarImg src={avatar} /> : <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
          </svg>}
        </AvatarUpload>

        <AvatarInput onChange={onAvatarChange} id="avatar" type='file' accept='image/*' />
        <Name>
          {user?.displayName ? user.displayName : "anonymous" }
        </Name>

      </Wrapper>
    </>
  )
}
