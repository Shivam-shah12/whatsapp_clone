import React from 'react'
import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import MessageBar from './MessageBar';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Chat({socket}) {
  const [message,setMessage]=useState("");
  const currentChatUser=useSelector((state)=> state.auth.currentChatUser);
  // console.log(currentChatUser)
  const handleInput=(e)=>{
  setMessage(e.target.value);
  }
  return (<div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] ">
     <ChatHeader socket={socket}/>
     <ChatContainer/>
     <MessageBar socket={socket}/>
    </div>);
}

export default Chat;
