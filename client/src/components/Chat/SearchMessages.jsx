import { setCurrentChatUser, setMessageSearch } from "@/reducer/Slices/authSlice";
import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
// import { BsFilter } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { calculateTime } from "@/utils/CalculateTime";
import { useEffect } from "react";

function SearchMessages() {
  const dispatch = useDispatch();
  const { messageSearch,currentChatUser,allMessage,userInfo } = useSelector((state) => state.auth);

  const [searchTerm, setsearchTerm] = useState("");
  const [searchedMessages, setsearchedMessages] = useState([]);

  // Simple debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const handleSearch = () => {
      if (searchTerm) {
        // const id1=currentChatUser?.id;
        // const id2=userInfo?.id;

        // console.log(allMessage);
       
        setsearchedMessages(
          allMessage.filter(
            (message) =>
              message.type === "text" && message.message.includes(searchTerm)
          )
        );
      } else {
        setsearchedMessages([]);
      }
    };

    const debouncedSearch = debounce(handleSearch, 300);

    if (searchTerm) {
      debouncedSearch();
    } else {
      setsearchedMessages([]);
    }

    return () => {
      clearTimeout(debouncedSearch);
    };
  }, [searchTerm]);

  return (
    <div className="relative border-conversation-border border-1 w-full bg-conversation-panel-background">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <RxCross2
          className="cursor-pointer text-icons-lighter text-2xl"
          onClick={() => dispatch(setMessageSearch(!messageSearch))}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search Messages"
                  className="bg-transparent text-sm focus:outline-none text-white w-full"
                  value={searchTerm}
                  onChange={(e) => setsearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length && `Search for messages with ${currentChatUser?.name}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {searchedMessages.map((message) => (
              <div className="flex w-full px-5 border-b-[0.1px] py-5 border-secondary cursor-pointer flex-col justify-center hover:bg-background-default-hover">
                <div className="text-sm text-secondary">{calculateTime(message.createAt)}</div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
