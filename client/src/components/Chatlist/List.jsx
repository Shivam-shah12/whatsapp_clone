import { setUserContacts } from "@/reducer/Slices/authSlice";
import { GET_INTIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatLIstItem from "./ChatLIstItem";
import axios from "axios";

function List() {
  const {userInfo,userContacts,filteredContacts}=useSelector((state)=> state.auth);
  console.log(filteredContacts)
  const dispatch=useDispatch();
  useEffect(()=>{
   const getContacts=async ()=>{
    try {
      const { data:{users}}=await axios(`${GET_INTIAL_CONTACTS_ROUTE}/${userInfo.id}`);
      // console.log(users);
      dispatch(setUserContacts(users));
    } catch (error) {
      console.log(error)
    }
   }
   if(userInfo?.id)
   getContacts();
  },[userInfo]);
   return(
   <div  className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar ">
    {
       filteredContacts && filteredContacts.length > 0 ? 
       filteredContacts.map((contact)=>(
        <ChatLIstItem data={contact} key={contact.id}/>
       )):
       userContacts.map((contact) => (
        <ChatLIstItem data={contact} key={contact.id}/>
       ))
    }
  
    </div>
    );
} 

export default List;
