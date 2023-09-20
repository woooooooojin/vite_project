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
            collection(db,"posts"), //어떤 컬렉션을 쿼리 하고 싶은지,, firestore 인스턴스를 매개변수로 넘겨준다
            orderBy("createdAt","desc") //createdAt의 기준으로 내림차순 정렬 
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
