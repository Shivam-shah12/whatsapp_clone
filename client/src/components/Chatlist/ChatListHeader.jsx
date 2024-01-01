import { getAdditionalUserInfo } from "firebase/auth";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {BsFillChatLeftTextFill,BsThreeDotsVertical} from 'react-icons/bs'
// import {setContactPage} from '../../reducer'
import Avatar from "../common/Avatar";
import { setContactPage } from "@/reducer/Slices/authSlice";
function ChatListHeader() {
  const dispatch=useDispatch()
  const iscontactsPage=useSelector((state)=> state.auth.iscontactsPage)
  const userInfo=useSelector((state)=> state.auth.userInfo)
  // console.log(userInfo)
  const handleAllContactPage=()=>{
    console.log(iscontactsPage)
    dispatch(setContactPage(!iscontactsPage))
  }
  return (
  <div className="h-16 px-4 py-3 flex justify-between items-center">
    <div className="cursor-pointer">
      <Avatar type="sm" image={userInfo?.profilePicture}/>
      {/* <Image src={"/avatars/1.png"} fill/> */}
    </div>
    <div className="flex gap-4  space-x-6 text-white">
     <BsFillChatLeftTextFill className="text-panel-header-icon cursor-pointer text-xl" 
     title="NewChat"
     onClick={handleAllContactPage}
     />
     <>
     <BsThreeDotsVertical className="text-panel-header-icon cursor-pointer text-xl" title="setting"/>
     </>
     </div>
    </div>);
}

export default ChatListHeader;
