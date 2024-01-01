import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { CHECK_USER_ROUTE, GET_MESSAGE_ROUTE, HOST } from "@/utils/ApiRoutes";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { setUser, setAllMessage, setAddMessage, setSocket, setIncomingVoiceCall, setIncomingVideoCall, setEndCall } from "@/reducer/Slices/authSlice";
import { io } from "socket.io-client";
import ChatList from "./Chatlist/ChatList";
import Empty from "./Empty";
import Chat from "./Chat/Chat";
import SearchMessages from "./Chat/SearchMessages";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";

function Main() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [socketEvent, setSocketEvent] = useState(false);
  const { userInfo, currentChatUser, messageSearch, videoCall, voiceCall, incomingVoiceCall, incomingVideoCall } = useSelector((state) => state.auth);
  const [redirectLogin, setRedirectLogin] = useState(false);
  const socket = useRef(null);

  // Use onAuthStateChanged to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser) setRedirectLogin(true);
      if (!userInfo && currentUser?.email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });
        dispatch(setUser(data.data));
        if (!data.status) {
          router.push("/login");
        }
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [userInfo, router, dispatch]);

  // Establish and cleanup socket connection
  useEffect(() => {
    if (userInfo) {
      // Initialize socket connection when userInfo changes
      socket.current = io(HOST);
      console.log(socket.current);
      socket.current.emit("setup", userInfo.id);
      socket.current.on("connection", () => setSocketEvent(true));
      dispatch(setSocket(socket.current));

      // Cleanup the socket connection when the component unmounts
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  // Listen for "msg-receive" event
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("message received", (data) => {
        console.log("Data in msg-receive frontend =", data.message.message);
        dispatch(setAddMessage(data.message.message));
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch(
          setIncomingVoiceCall({
            ...from,
            roomId,
            callType,
          })
        );
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch(
          setIncomingVideoCall({
            ...from,
            roomId,
            callType,
          })
        );
      });

      socket.current.on("voice-call-rejected", () => {
        dispatch(setEndCall());
      });

      socket.current.on("video-call-rejected", () => {
        dispatch(setEndCall());
      });
      

      setSocketEvent(true);
    }
  }, [socket.current]);

  // Fetch messages when currentChatUser changes
  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`${GET_MESSAGE_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
        dispatch(setAllMessage(data.messages));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentChatUser?.id) {
      getMessages();
    }
  }, [userInfo, currentChatUser, dispatch]);

  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )
      }
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full">
          <ChatList />
          {currentChatUser ? (
            <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
              <Chat />
              {messageSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

export default Main;
