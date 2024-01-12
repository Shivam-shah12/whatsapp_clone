import { setEndCall } from "@/reducer/Slices/authSlice";
import { data } from "autoprefixer";
import React from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useState,useEffect } from "react";
import Image from "next/image";
import axios from 'axios'
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";

function Container({data}) {
  const {socket,userInfo,videoCall}=useSelector((state)=> state.auth);
  const [callAccepted,setCallAccepted]=useState(false);
  const [token,setToken]=useState(undefined);
  const [zgVar,setZgVar]=useState(undefined);
  const [localStream,setLocalStream]=useState(undefined)
  const [publishStream,setPublishStream]=useState(undefined);

  const dispatch=useDispatch();
  console.log(data)
  useEffect(()=>{
    console.log(data);
    if(data.type === "out-going")
    {
      socket.on("accept-call",(val)=>setCallAccepted(val))
     }
    else if(data.type==="incoming")
   {
    setTimeout(()=>{
      setCallAccepted(true);
    },1000)
  }
  },[data]);
  useEffect(()=>{
   const getToken=async()=>{
      try{
          const {data:{token:returnedToken}}=await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
          // console.log(returnedToken);
          setToken(returnedToken);
      }
      catch(err){
        console.log(err);
      }
    }
    // if(callAccepted === true)
    getToken();
  },[callAccepted])

  useEffect(()=>{
    const startCall=async()=>{

      import ("zego-express-engine-webrtc").then(async({ZegoExpressEngine})=>{
        const appId=process.env.NEXT_PUBLIC_ZEGO_APP_ID;
        const server=process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET_ID;
        const zg=new ZegoExpressEngine(appId,server);
        setZgVar(zg);
        zg.on("roomStreamUpdate",async(roomId,updateType,streamList,extendedData)=>{
            if(updateType === "ADD")
            {
             const rmVideo=document.getElementById("remote-video");
             const vd=document.createElement(
              data.callType === "video" ? "video" : "audio"
             );
             vd.id=streamList[0].streamID;
             vd.autoplay=true;
             vd.playsInline=true;
             vd.muted = false;
             if(rmVideo)
             {
              rmVideo.appendChild(vd);
             }
             zg.startPlayingStream(streamList[0].streamID,{
              audio:true,
              video:true,
             }).then((stream)=> (vd.srcObject = stream));
            }
            else if(updateType === "DELETE" && zg && localStream && streamList[0].streamID){
              zg.destroyStream(localStream);
              zg.stopPublishingStream(streamList[0].streamID);
              zg.logoutRoom(data.roomId.toString());
              dispatch(setEndCall());
            }
        });
        
// // Room status update callback
// zg.on('roomStateChanged', (roomID, reason, errorCode, extendData) => {
//   if (reason == ZegoRoomStateChangedReason.Logining) {
//       // logging in
//       // Represents the callback in the connection triggered by the developer actively calling loginRoom
//   } else if (reason == ZegoRoomStateChangedReason.Logined) {
//       // login successful
//       //Only when the room status is successful login or reconnection, push streaming (startPublishingStream) and pull streaming (startPlayingStream) can normally receive and receive audio videos.
//       //Push your own audio and video streams to ZEGOCLOUD audio and video cloud
//   } else if (reason == ZegoRoomStateChangedReason.LoginFailed) {
//       // Login failed
//   } else if (reason == ZegoRoomStateChangedReason.Reconnecting) {
//       // Reconnecting
//   } else if (reason == ZegoRoomStateChangedReason.Reconnected) {
//       // Reconnection successful
//   } else if (reason == ZegoRoomStateChangedReason.ReconnectFailed) {
//       // Reconnect failed
//   } else if (reason == ZegoRoomStateChangedReason.Kickout) {
//       // kicked out of the room
//   } else if (reason == ZegoRoomStateChangedReason.Logout) {
//       // Logout successful
//   } else if (reason == ZegoRoomStateChangedReason.LogoutFailed) {
//       // Logout failed
//   }
// });
        await zg.loginRoom(data.roomId.toString(),
        token,
        {userID:userInfo.id.toString(),userName:userInfo.name},
         {userUpdate:true}
        ).then(async(result)=>{
          if(result==true)
          {
            
            const localStream=await zg.createStream({
              camera:{
                audio:{
                  channelCount: 2
                },
                video:data?.callType === "video" ? true :false,
              }
            });
    
            const localVideo=document.getElementById("local-audio");
            const element=document.createElement(
              data.calltype === "video" ? "video" : "audio"
            );
            element.id = "video-local-zego";
            element.className="h-30 w-32 relative";
            element.autoplay=true;
            element.muted=false;
    
            element.playsInline=true;
            localVideo.appendChild(element);
            const td=document.getElementById("video-local-zego");
            if(td.tagName === "video")
            td.srcObject=localStream;
            const streamID='123'+Date.now();
            setPublishStream(streamID);
            setLocalStream(localStream);
            zg.startPublishingStream(streamID,localStream);
    
          }
        })
        

        })
        
  

      
    }
    if(token){
    startCall();
  }
  },[token]);
  const handleCallEnd=()=>{
    const id=data.id;
    if(data.callType === "voice"){
    socket.emit("reject-voice-call",{
      from:id,
    });
    if(zgVar && localStream && publishStream)
    {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
  }else
  {
    socket.emit("reject-video-call",{
      from:id
    });
  }
    dispatch(setEndCall());
  }



  return <div className="border-conversation-border border-1 text-white w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center">
    <div className="flex flex-col gap-3 items-center">
      <span className="text-5xl">{data.name}</span>
      <span className="text">
        {
    !callAccepted  ? "Calling" : (data.callType !=="video" ? "on-going Call" : "")
         
        }
      </span>
    </div>
    {
      (!callAccepted && data.callType === "audio") && (<div className="my-24">
        <Image src={data.profilePicture} alt="avatar" height={300} width={300} className="rounded-full"/>
      </div>)
    }
     <div className="my-5 relative" id="remote-video">
      <div className="absolute bottom-5 right-5 flex justify-center items-center" id="local-audio"></div>
     </div>
    <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
      <MdOutlineCallEnd className="text-3xl cursor-pointer" onClick={handleCallEnd}/>
    </div>
    </div>;
}

export default Container;
