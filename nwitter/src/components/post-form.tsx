import { addDoc, collection, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { styled } from "styled-components"
import { auth, db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"


const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`
const TextArea = styled.textarea`
    border: 2px solid #fff;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    background-color: black;
    width: 100%;
    resize: none;
    transition: .3s;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    &::placeholder{
        font-size: 16px;
       
    }
    &:focus{
        outline: none;
        border-color: steelblue;
    }
`
const AttachFileBtn = styled.label`
    padding: 10px 0;
    color: steelblue;
    text-align: center;
    border-radius: 20px;
    border: 1px solid steelblue;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`
const AttachFileInput = styled.input`
    display: none;
`
const SubmitBtn = styled.input`
    background-color: steelblue;
    color: #fff;
    border: none;
    padding: 10px 0;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: all .3s;
    &:hover,
    &:active{
        opacity: 0.8;
    }
`



export default function PostForm() {

    const [isLoding, setIsLoading] = useState(false);
    const [post, setPost] = useState(''); //게시글 업로드
    const [file, setFile] = useState<File|null>(null); //파일업로드

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setPost(e.target.value)
    }
    const onFileChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {files} = e.target
        if(files && files.length === 1){
            setFile(files[0])
        }
    } //인풋 파일이 변경될때마다  파일의 배열을 받음  여러파일이 올라가지않게 하나만 올림,, 파일이 존재하고 하나만 있는경우만 setfile에 저장한다

    const onSubmit = async (e:React.ChangeEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const user = auth.currentUser //사용자정보
        if(!user || isLoding || post === '' || post.length > 200 ) return // 이 경우에는 함수를 종료

        try{
            setIsLoading(true)
            const doc = await addDoc(collection(db,'posts'), { //addDoc > 파일을 업로드할 document를 생성한다
                post,
                createdAt: Date.now(),
                username: user.displayName || "anonymous",
                userId: user.uid,

            })
            if(file && file.size < 1024 ** 2){//파일이 존재하거나 파일이 1메가가 넘지 않는다면
                const locationRef = ref(storage,`posts/${user.uid}/${doc.id}`) //ref >> 파일을 업로드할 위치 지정 storage에 저장하는 경로
                const result = await uploadBytes(locationRef,file) //uploadBytes 파일을 업로드한 후 결과에 대한 정보를 담은 promise를 반환함
                const url = await getDownloadURL(result.ref) //업로드한 사진의 url을 uploadBytes에서 반환한 promise에서 추출가능
                await updateDoc(doc,{ //updateDoc매서드를 통해 doc에 다운로드 링크를 첨부할 수 있다,,
                    photo:url
                })
            }
            setPost("")
            setFile(null)
        }catch(e){
            console.log(e)
        }finally{
            setIsLoading(false)
        }

    }
  return (
    <>
        <Form onSubmit={onSubmit}>
            <TextArea required rows={5} maxLength={200} onChange={onChange} value={post} placeholder="내용을 입력해 주세요."></TextArea>
            <AttachFileBtn htmlFor="file">{file ? 'added photo' : 'add photo'}</AttachFileBtn>
            <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*"/>
            <SubmitBtn type="submit" value={isLoding ? "posting..." : "post"}></SubmitBtn>
        </Form>
    </>
  )
}
