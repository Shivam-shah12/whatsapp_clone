import React from "react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const Container=dynamic(()=> import ("./Container",{ssr:false}));
function VoiceCall() {
  
  const {voiceCall,userInfo,socket}=useSelector((state)=> state.auth);
  // console.log(socket);
  useEffect(()=>{
    if(voiceCall.type === "out-going"){

      socket.emit("outgoing-voice-call",{
        to:voiceCall.id,
        from:{
          id:userInfo.id,
          profilePicture:userInfo.profilePicture,
          name:userInfo.name,
        },
        callType:voiceCall.callType,
        roomId:voiceCall.roomId
      })
    }
  },[voiceCall])
  console.log(voiceCall)
 
  return voiceCall && <Container data={voiceCall}/>;
}

export default VoiceCall;
