import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { setEndCall, setIncomingVideoCall, setVideoCall } from "@/reducer/Slices/authSlice";

function IncomingVideoCall() {
  const { incomingVideoCall, videoCall, socket } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
   console.log(incomingVideoCall)
  const acceptCall = () => {
    dispatch(
      setVideoCall({
        ...incomingVideoCall,
        type: "incoming",
      })
    );
    // console.log(socket.current);
    socket.emit("accept-incoming-call", { id:incomingVideoCall.id});
    dispatch(setIncomingVideoCall(undefined));
  };

  const rejectCall = () => {
    socket.emit("reject-video-call", {
      from: incomingVideoCall.id,
    });
    dispatch(setEndCall());

  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Timeout logic: If acceptCall is not triggered within 30 seconds, unmount the component
      console.log("IncomingCall component will unmount");
      // Perform any cleanup logic if needed
      // For example, you might want to reject the call automatically
      rejectCall();
    }, 30000);

    // Clean up the timeout when the component unmounts or when acceptCall is triggered
    return () => clearTimeout(timeoutId);
  }, [acceptCall]);

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image src={incomingVideoCall.profilePicture} alt="avatar" width={70} height={70} className="rounded-full" />
      </div>
      <div>
        <div>{incomingVideoCall.name}</div>
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-1 px-3 text-sm rounded-full"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
