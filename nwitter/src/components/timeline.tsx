import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Post from "./post";

export interface IPost{
    id:string;
    photo?:string;
    post:string;
    userId:string;
    username:string;
    createdAt:number;
}


const Wrapper = styled.div`
    
`

export default function TimeLine() {
    const [posts, setPosts] = useState<IPost[]>([])
    const fetchPosts = async()=>{
        const postQuery = query(
            collection(db,"posts"),
            orderBy("createdAt","desc")
        )
        const snapshot = await getDocs(postQuery)
        const posting =  snapshot.docs.map((doc) => {
            const {post, createdAt, userId, username, photo} = doc.data();
            return{
                post, createdAt, userId, username, photo,
                id:doc.id
            }
       })
       setPosts(posting)
    }
    useEffect(()=>{fetchPosts()},[])
  return (
    <>
        <Wrapper>
           {
            posts.map(post=><Post key={post.id} {...post}/>)
           }
        </Wrapper>
    </>
  )
}
