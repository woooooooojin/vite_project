import { styled } from "styled-components";
import { IPost } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";


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

const EditButton = styled.button`
    background-color: tomato;
    color: #fff;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
`
const TextArea = styled.textarea`
    resize: none;
    display: block;
    margin: 5px 0;
`
const ChangePhotoInput = styled.input`
  width: 100%;
`;

export default function Post({username, photo, post, userId, id}:IPost) {

    const user = auth.currentUser;
    const [editMode, setEditMode] = useState(false)
    const [editPost, setEditPost] = useState(post)
    const [file, setFile] = useState<File | null>(null);



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

    const onEdit = async()=>{
        setEditMode((prev) => !prev)
        if(!editMode) return;
    
        try{
            if(file !== null){
                //기존 이미지 삭제
                const photoRef = ref(storage,`posts/${user?.uid}/${id}`)
                await deleteObject(photoRef)
                //새로 업데이트
                const locationRef = ref(storage,`posts/${user?.uid}/${id}`)
                const result = await uploadBytes(locationRef,file)
                const imgUrl = await getDownloadURL(result.ref)
                updateDoc(doc(db,"posts",id),{
                    post : editPost,
                    imgUrl,
                });
                
            }else{
                //글자 포스팅만 업로드
                updateDoc(doc(db,"posts",id),{
                    post : editPost,
                })
            }
        }catch(e){
            console.log(e)
        }finally{
            setEditMode(false)
            setFile(null)
        }
    }

    const onTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        const {
            target : {value},
        } = e

        setEditPost(value)
    }

    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {files} = e.target
        if(files && files.length === 1){
            if (files[0].size > 1000000){
                e.target.value = ""
                return alert("Photo size too big! you can upload under 1MB");
            }
            setFile(files[0]);
        }
    }

  return (
    <>
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {editMode ? (<TextArea onChange={onTextChange} value={editPost}></TextArea>) : ( <Payload>{post}</Payload>)}
                {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null} 
                {user?.uid === userId ? <EditButton onClick={onEdit}>{editMode ? "Save" : "Edit"}</EditButton> : null}
            </Column>

           <Column>
          
            {editMode ? (
                <ChangePhotoInput
                    onChange={onFileChange}
                    id="file"
                    accept="image/*"
                    type="file"
                />
                ) : ( photo && <Photo src={photo} /> )}
           </Column> 
            

        </Wrapper>
    </>
  )
}
