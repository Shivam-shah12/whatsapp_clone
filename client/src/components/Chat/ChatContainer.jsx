import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import MessageStatus from "../common/MessageStatus";
import { calculateTime } from "@/utils/CalculateTime";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage=dynamic(()=> import ("./VoiceMessage"),{ssr:false});

function ChatContainer() {
  const { allMessage, currentChatUser } = useSelector((state) => state.auth);

  // Ensure that allMessage is an array before mapping over it
  const messagesToDisplay = Array.isArray(allMessage) ? allMessage : [];

  // useEffect for logging allMessage when it changes
  useEffect(() => {
    console.log("allMessage has changed:", allMessage);
  }, [allMessage]);

  return (
    <div className="h-[60vh] relative w-full flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0" />
      <div className="flex z-40">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto p-2">
            {messagesToDisplay.map((message) => (
              <div key={message?.id} className={`${getMessageContainerClass(message, currentChatUser)}`}>
                {message?.type === "text" && (
                  <div className={getMessageTextClass(message, currentChatUser)}>
                    <span className="break-all text-white">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <MessageStatus messageStatus={message.messageStatus} />
                    </div>
                  </div>
                )}
                {
                  message?.type ==="image" && (
                    <ImageMessage message={message}/>
                  )
                }
                {
                  message?.type === "audio" && (
                    <VoiceMessage message={message}/>
                  )
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getMessageContainerClass(message, currentChatUser) {
  return `${message?.senderId == currentChatUser?.id ? "flex justify-start" : "flex justify-end"}`;
}

function getMessageTextClass(message, currentChatUser) {
  return `text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${message?.senderId === currentChatUser?.id ? "bg-incoming-background" : "bg-outgoing-background"}`;
}

export default ChatContainer;
