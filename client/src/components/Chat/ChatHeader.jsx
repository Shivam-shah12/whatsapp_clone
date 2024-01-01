import React from "react";
import Avatar from "../common/Avatar";
import { FcMissedCall } from "react-icons/fc";
import { BiVideo } from "react-icons/bi";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector,useDispatch } from "react-redux";
import { useState } from "react";
import { setMessageSearch, setVideoCall, setVoiceCall } from "@/reducer/Slices/authSlice";


function ChatHeader() {
  const {currentChatUser,messageSearch}=useSelector((state)=> state.auth);
  const dispatch=useDispatch();
  console.log(messageSearch)
  const [isContextMenuVisible,setIsContextMenuVisible]=useState(false);
  const [contextMenuCordinates,setcontextMenuCordinates]=useState({
    x:0,y:0
  })
  const showContextMenu=(e)=>{
    e.preventDefault();
    setIsContextMenuVisible(true);
    setcontextMenuCordinates({x:e.pageX,y:e.pageY});
}

const showContextMenuOption = [
  { name: 'Exit', callback: async() => {
    // isko define karna hai --> resume video from 10:02:52
    dispatch(setExitChat());
  } }
];

  
  
  const handleVoiceCall = () => {
    const voiceCallPayload = {
      ...currentChatUser,
      type: "out-going",
      callType: "voice",
      roomId: Date.now(),
    };

    dispatch(setVoiceCall(voiceCallPayload));
  };
  const handleVideoCall = () => {
    const videoCallPayload = {
      ...currentChatUser,
      type: "out-going",
      callType: "video",
      roomId: Date.now(),
    };

    dispatch(setVideoCall(videoCallPayload));
  };
  return (
  <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
     <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profilePicture}/>
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondart text-sm">online/offline</span>
        </div>
     </div>
     <div className="flex gap-6">
      <FcMissedCall className="text-panel-header-icon cursor-pointer text-xl"
      onClick={handleVoiceCall}
      />
      <BiVideo  className="text-panel-header-icon cursor-pointer text-xl"
      onClick={handleVideoCall}
      />
      <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" onClick={()=>dispatch(setMessageSearch(!messageSearch))} />
      <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl"
       onClick={()=>showContextMenu(e) }
       id="context-opener"
      />
     {
      isContextMenuVisible && (
        <ContextMenu
        options={showContextMenuOption}
        cordinates={contextMenuCordinates}
        contextMenu={isContextMenuVisible}
        setContextMenu={setIsContextMenuVisible}
        
        />
      )
     }
     
     
     </div>

    </div>
    );
}

export default ChatHeader;
