import { styled } from "styled-components"
import { auth, db, storage } from "../firebase"
import { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { collection, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { IPost } from "../components/timeline"
import Post from "../components/post"


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

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`
const NameEdit = styled.button`
  padding: 5px;
  border-radius: 5px;
  border: 0;
  background-color: tomato;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  margin-left: 5px;
`
const NameWrap = styled.div`
 
  
`
const NameInput = styled.input`
  background-color: black;
  font-size: 16px;
  text-align: center;
  color: white;
  border: 1px solid white;
  border-radius: 15px;
  outline: none;
`

export default function Profile() {

  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)
  const [posts, setPosts] = useState<IPost[]>([])
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(user?.displayName ?? "anonymous")


  const fetchPosts = async()=>{
    const postQuery = query(
      collection(db,"posts"),
      where("userId","==",user?.uid), //userid 와 currenuser의 uid가 같은것을 필터링 
      orderBy("createdAt","desc"),
      limit(25)
    )
    const snapshot = await getDocs(postQuery)
    const posts = snapshot.docs.map(doc=>{
      const {post, createdAt, userId, username, photo} = doc.data();
      return{
          post, createdAt, userId, username, photo,
          id:doc.id
      }
    })
    setPosts(posts)
  }
  useEffect(()=>{fetchPosts()},[])


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


  const onChangeNameClick = async()=>{

    if(!user) return;
    setEditMode((prev)=>!prev)
    if(!editMode) return;

    try{
      await updateProfile(user,{
        displayName : name,
      })
    }catch(e){
      console.log(e)
    }finally{
      setEditMode(false)
    }

  }
  

  const onChangeName = (e:React.ChangeEvent<HTMLInputElement>)=>{

    setName(e.target.value)

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

        {editMode ? (
        <NameWrap>
          <NameInput onChange={onChangeName} type="text" value={name}></NameInput>
          
        </NameWrap>) : 
        (<Name>
          {user?.displayName ? user.displayName : "anonymous" }
        </Name>)}

        <NameEdit onClick={onChangeNameClick}>{editMode ? "Save" : "Change Name"}</NameEdit>

        
        
        <Posts>{posts.map(post => <Post key={post.id} {...post}/>)}</Posts>
      </Wrapper>
    </>
  )
}
