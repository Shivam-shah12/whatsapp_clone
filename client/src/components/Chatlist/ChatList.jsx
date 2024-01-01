import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import { useSelector } from "react-redux";
import ContactsList from "./ContactsList";

function ChatList() {
  const iscontactsPage=useSelector((state)=> state.auth.iscontactsPage)
  const [pageType, setpageType] = useState("default");
  useEffect(()=>{
    if(iscontactsPage===true)
    setpageType("all-contacts");
    else
    setpageType("default");
  },[iscontactsPage])
  return <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
  {
     pageType==="default" && <>
      <ChatListHeader/>
     <SearchBar/>
     <List/>
     </>
  }
  {
    pageType==="all-contacts" && <ContactsList/>
  }
   
    </div>;
}

export default ChatList;
