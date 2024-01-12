import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import React from "react";
import { useSelector } from "react-redux";
import MessageStatus from "../common/MessageStatus";
import { Document, Page } from 'react-pdf';

function DocumentMessage({ message }) {
  const { currentChatUser, userInfo } = useSelector((state) => state.auth);
  console.log(message)
  const documenturl=`${HOST}/${message.message}`
  console.log(documenturl)
 


  return (
    <div className={`p-1 rounded-lg ${message.senderId===currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
     <div className="relative">
     <iframe src={`${HOST}/${message.message}`} width="100%" height="400px" title="Document Viewer"></iframe>

      <div className="absolute bottom-1 right-1 flex items-end gap-1">
        <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.createdAt)}
        </span>
        <span className="text-bubble-meta">
        <MessageStatus messageStatus={message.messageStatus} />
        </span>
      </div>
     </div>
    </div>
  )
}

export default DocumentMessage;
