import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Post from "./post";
import { Unsubscribe } from "firebase/auth";

export interface IPost{
    id:string;
    photo?:string;
    post:string;
    userId:string;
    username:string;
    createdAt:number;
}


const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;
`

export default function TimeLine() {
    const [posts, setPosts] = useState<IPost[]>([])
    
    useEffect(()=>{
        let unsubscribe : Unsubscribe | null = null;
        const fetchPosts = async()=>{
        const postQuery = query(
            collection(db,"posts"), //어떤 컬렉션을 쿼리 하고 싶은지,, firestore 인스턴스를 매개변수로 넘겨준다
            orderBy("createdAt","desc"), //createdAt의 기준으로 내림차순 정렬 
            limit(25)
        )
    //     const snapshot = await getDocs(postQuery)
    //     const posting =  snapshot.docs.map((doc) => {
    //         const {post, createdAt, userId, username, photo} = doc.data();
    //         return{
    //             post, createdAt, userId, username, photo,
    //             id:doc.id
    //         }
    //    })
         unsubscribe = await onSnapshot(postQuery, (snapshot) => { 
            //onSnapshot은 특정 문서나 컬렉션, 쿼리 이벤트를 감지하여 realtime으로 이벤트콜백 함수를 실행해줄 수있다. 이를통해 db에 들어온 쿼리를 새로고침없이 화면에 반영할 수있다. useEffect의 cleanup 기능을 이용하여 컴포넌트가 언마운트될 때 onSnapshot이 실행되지 않도록 할수 있다.
           const posting = snapshot.docs.map((doc) => {
                const {post, createdAt, userId, username, photo} = doc.data();
                return{
                    post, createdAt, userId, username, photo,
                    id:doc.id
                }
            })
            
            setPosts(posting)
            
        })
    }; fetchPosts();
        return()=>{
            unsubscribe && unsubscribe()
        }
    },[])
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
