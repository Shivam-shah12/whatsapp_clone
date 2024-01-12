import React from "react";
import Avatar from "../common/Avatar";
import { useSelector } from "react-redux";
import { setContactPage, setCurrentChatUser } from "@/reducer/Slices/authSlice";
import { useDispatch } from "react-redux";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";

function ChatLIstItem({data}) {
  const {userInfo,currentChatUser,iscontactsPage}=useSelector((state)=> state.auth);
 console.log(data);
  const dispatch=useDispatch();
  const handleContactClick=()=>{
    if(!iscontactsPage)
    {
      console.log(data);
        dispatch(setCurrentChatUser(data));
    }
    else
    {
        //  console.log(data)
     dispatch(setCurrentChatUser(data));
     //  console.log(currentChatUser)
      dispatch(setContactPage(!iscontactsPage))
    }
   
  }


  return <div className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
   onClick={handleContactClick}
  >
    <div className="min-w-fit px-5 pt-3 pb-1">
      <Avatar type="lg" image={data?.profilePicture}/>
    </div>
    <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
      <div className="flex justify-between">
        <div>
          <span className="text-white">{data?.name}</span>
        </div>
        {
          !iscontactsPage && (
            <div>
              <span className={`${!data.totalUnreadMessages > 0} ? text-secondary:  text-icon-green`}>
                {calculateTime(data.createdAt)}
              </span>
            </div>
          )
        }
      </div>
      <div className="flex border-b border-conversation-border pb-2 pt-1 pl-2">
        <div className="flex justify-between w-full">
          <span className="text-secondary line-clamp-1 text-sm">
            {iscontactsPage ?data?.about || "\u00A0" :
            (
              <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
               {
                data.senderId === userInfo.id && <MessageStatus messageStatus={data.messageStatus}/>
               }
              {
                data.type === "text" && (
                  <span className="truncate">{data.message}</span>
                )
              }
              {
                data.type === "audio" && 
                (<span className="flex gap-1 items-center">
                  <FaMicrophone className="text-panel-header-icon"/>
                  Audio
                </span>)
              }
              {
                data.type === "image" && 
                (<span className="flex gap-1 items-center">
                  <FaCamera className="text-panel-header-icon"/>
                  Image
                </span>)
              }

              </div>
            )
            
            }

          </span>
          {
            data.totalUnreadMessages > 0 && <span className="bg-icon-green px-[5px] rounded-full text-sm"/>
          }
        </div>
      </div>
    </div>
     </div>;
}

export default ChatLIstItem;
