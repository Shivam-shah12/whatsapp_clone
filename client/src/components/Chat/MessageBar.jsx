import React, { useState,useEffect } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import   {ImAttachment}  from 'react-icons/im'
import {MdSend} from 'react-icons/md'
import {FaMicrophone} from 'react-icons/fa'
import { ADD_MESSAGE_ROUTE ,ADD_IMAGE_ROUTE,ADD_DOCUMENT_ROUTE} from "@/utils/ApiRoutes";
import axios from "axios";
import { useSelector } from "react-redux";
import Input from "../common/Input";
import { io } from "socket.io-client";
import { HOST } from "@/utils/ApiRoutes";
import { setAddMessage } from "@/reducer/Slices/authSlice";
import { useDispatch } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
// import CaptureAudio from "../common/CaptureAudio";
const CaptureAudio=dynamic(()=> import ("../common/CaptureAudio"),{ssr:false});



function MessageBar() {
  const dispatch=useDispatch();
  const {socket}=useSelector((state)=> state.auth);
  // console.log(socket);
  const allmessage=useSelector((state)=>state.auth.allMessage);
  const {userInfo,currentChatUser}=useSelector((state)=> state.auth)
  const [message,setMessage]=useState();
  const [showEmojiPicker,setShowEmojiPicker]=useState(false);
  const EmojiPickerRef=useRef(null);
  const [grapPhoto,setGrabPhoto]=useState(false);
  const [showAudioRecorder, setshowAudioRecorder] = useState(false)
 
  const handleEmojiModal=()=>{
   
    setShowEmojiPicker(!showEmojiPicker);
  }
  const photoPickerChange=async(e)=>{
    console.log(e.target.files[0]);
    
    try {
      const file=e.target.files[0];
      console.log(file)
      const formData=new FormData();
      const isImage = file.type.startsWith('image/');
      // formData.append(isImage ? 'image' : 'document', file);
      if(isImage)
      formData.append("image",file);
      else
      formData.append("document",file)
      console.log(formData);
      // console.log(isImage);
      const response=await axios.post(isImage ? ADD_IMAGE_ROUTE : ADD_DOCUMENT_ROUTE,formData,
        {
          headers:{
          "Content-Type":"multipart/form-data",
         },
        params:{
          from:userInfo.id,
          to:currentChatUser.id,
        }
      });
      console.log(response.data);
      if(response.status===201)
      {
        socket.emit("new message",{
          to:currentChatUser?.id,
          from:userInfo?.id, 
          message:response.data.newMessages,
         })
         dispatch(setAddMessage(response.data.newMessages));
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(()=>{
    const handleOutsideClick=(event)=>{
      if(event.target.id !=="emoji-open"){
        if(EmojiPickerRef.current && !EmojiPickerRef.current.contains(event.target))
        {
          setShowEmojiPicker(false);
        }
      }
    }
    return ()=>{
      document.addEventListener("click",handleOutsideClick);
    }
    
  },[])

  const handleEmojiClick=(emoji)=>{
    console.log(emoji)
       setMessage((prevMessage)=>(prevMessage+=emoji.emoji));
  }
  const sendMessage=async()=>{
    try {
      const {data}=await axios.post(ADD_MESSAGE_ROUTE,{
        to:currentChatUser?.id,
        from:userInfo?.id,
        message
      })
      console.log(data)
      socket.emit("new message",{
       to:currentChatUser?.id,
       from:userInfo?.id, 
       message:data.message,
      })
      dispatch(setAddMessage(data.message));
      setMessage('');
    } catch (error) {
      console.log(error)
    }
  }
  const handleInput=(e)=>{
    //  console.log(e);
    setMessage(e.target.value);
  }
  useEffect(()=>{
    if(grapPhoto)
    {
      const data=document.getElementById("photo-picker")
      data.click();
      document.body.onfocus =(e)=>{
        setTimeout(()=>{
          setGrabPhoto(false);
        },1000);
      }
    }
  },[grapPhoto])
  return (
    <div className="flex relative justify-center h-20 bg-panel-header-background text-white px-4 items-center gap-6 ">
     {
      !showAudioRecorder && ( 
      <>
      <div className="flex gap-6">
        <BsEmojiSmile className="text-panel-header-icon cursor-pointer text-xl" title="Emoji" id="emoji-open" onClick={handleEmojiModal}/>
        {
          showEmojiPicker && <div className="absolute bottom-24 left-16 z-40" ref={EmojiPickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick}  theme="dark"/>
          </div>
        }
        <ImAttachment className="text-panel-header-icon cursor-pointer text-xl" title="Attach File" onClick={()=> setGrabPhoto(true)}/>
    </div>
      <div className="w-full rounded-lg h-10 flex items-center">
      
      <input
    type="text"
    // placeholder="Type a message"
    value={message}
    className="bg-input-background border text-sm focus:outline-none text-white h-10 w-full rounded-lg px-5 py-2"
    onChange={handleInput} 
  />
      </div>
      <div className="flex w-10 items-center justify-center">
          <button className="text-panel-header-icon cursor-pointer text-xl " >
            {
              message ?  (
                <MdSend 
                title="send Message"
                onClick={sendMessage}
            />
              ):(
                <FaMicrophone 
                className="text-panel-header-icon cursor-pointer text-xl" 
                title="Record Voice"
                onClick={()=> setshowAudioRecorder(true)}
                />
              )
            }
            
            
            </button>
      </div>
      </>
     )}
       {
          grapPhoto && <PhotoPicker onChange={photoPickerChange}/> 
        }
        {
          showAudioRecorder && <CaptureAudio hide={setshowAudioRecorder} socket={socket}/>
        }
 </div>
  );

}

export default MessageBar;
