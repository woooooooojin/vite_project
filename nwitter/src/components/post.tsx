import { styled } from "styled-components";
import { IPost } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";


const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 15px;


`
const  Column = styled.div``
const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`
const Payload = styled.p`
    margin: 10px 0;
    font-size: 18px;
`

const DeleteButton = styled.button`
    background-color: tomato;
    color: #fff;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
`


export default function Post({username, photo, post, userId, id}:IPost) {

    const user = auth.currentUser;
    const onDelete = async()=>{
        const ok = confirm('정말 삭제하겠습니까 ?') 
        if(!ok || user?.uid !== userId) return;
        try{
            //firebase에서 포스트를 삭제하려면 doc함수를 사용하여 db에서 해당 포스트를 찾고, deleteDoc함수에 입력해주어야 한다
            //doc함수의 인자: db, document 이름, id
            await deleteDoc(doc(db,"posts",id))
            if(photo){
                const photoRef = ref(storage,`posts/${user.uid}/${id}`) //firebase storage 사진의 경로
                // ref함수를 사용하여 저장소에서 이미지 파일의 참조를 얻고, deleteObject함수에 입력해주면 된다.
                await deleteObject(photoRef)
            }
        }catch(e){
            console.log(e)
        }finally{

        }
    }

  return (
    <>
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <Payload>{post}</Payload>
                {/* user의 아이디와 userId가 같은경우 버튼이 보임 */}
                {user?.uid ===  userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null} 
            </Column>
           <Column>{photo ? <Photo src = {photo}/>: null } </Column> 
            

        </Wrapper>
    </>
  )
}
