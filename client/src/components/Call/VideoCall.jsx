import React from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useEffect } from "react";
const Container=dynamic(()=> import ("./Container",{ssr:false}));

function VideoCall() {
  const {videoCall,userInfo,socket}=useSelector((state)=> state.auth);
  useEffect(()=>{
    if(videoCall.type === "out-going"){
      socket.emit("outgoing-video-call",{
        to:videoCall.id,
        from:{ 
          id:userInfo.id,
          profilePicture:userInfo.profilePicture,
          name:userInfo.name,
        },
        callType:videoCall.callType,
        roomId:videoCall.roomId
      })
    }
  })
  return <Container data={videoCall}/>;
}

export default VideoCall;
