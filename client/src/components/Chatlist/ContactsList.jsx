import { GET_CONTACT_USER } from "@/utils/ApiRoutes";
import React, { useEffect,useState } from "react";
import axios from "axios";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setContactPage, setCurrentChatUser } from "@/reducer/Slices/authSlice";
import { BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
import { useStyleRegistry } from "styled-jsx";


function ContactsList() {
  const dispatch=useDispatch();
  const iscontactsPage=useSelector((state)=> state.auth.iscontactsPage)
 
  const [allContact, setallContact] = useState([])
  useEffect(()=>{

    const getContacts=async()=>{
     try {
      const response=await axios.get(GET_CONTACT_USER);
      // console.log(response.data.data.users)
      setallContact(response.data.data.users)
     } catch (error) {
       console.log(error)
     }
    }
     getContacts()
  },[])
 
  const handlepageflip=()=>{
    dispatch(setContactPage(!iscontactsPage))
    dispatch(setCurrentChatUser(undefined))
  }


  return (<div className="h-full flex flex-col ">
    <div className="h-24 flex items-end px-3 py-4">
      <div className="flex items-center gap-12 text-white">
        <BiArrowBack
        className="cursor-pointer text-xl"
        onClick={handlepageflip}
        />
        <span>New Chat</span>
      </div>
      </div>
      <div className="bg-search-input-container  flex-auto  ">
      <div className="flex py-3 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 border rounded-lg flex-grow">
      <div>
        <BiSearchAlt2  className="text-panel-header-icon cursor-pointer text-xl"/>
      </div>
      <div>
        <input type="text" placeholder="Search Contacts" className="bg-transparent text-sm focus:outline-none text-white w-full"/>
      </div>
      </div>
      </div>
     
      </div>
      <div className="scroll-behavior-smooth overflow-auto hide-scrollbar">
      {
        Object.entries(allContact).map(([initialLetter,userList])=>{
      
             return (<div key={Date.now()+initialLetter} >
              <div className="text-teal-light pl-10 py-5">
              {userList?.name?.charAt(0)}
              </div>
              {
                (<ChatLIstItem data={userList} isContactPage={true} key={userList.id}/>)
              
              }
             </div>)
        })
       }
      </div>
      
    
    </div>);
}

export default ContactsList;
