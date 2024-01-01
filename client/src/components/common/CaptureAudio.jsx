import React,{useEffect, useReducer, useRef, useState} from "react";
import { FaTrash, FaPlay,FaStop, FaMicrophone, FaPauseCircle} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { io } from "socket.io-client";
import WaveSurfer from "wavesurfer.js";
import { useDispatch ,useSelector} from "react-redux";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios"
import { setAddMessage } from "@/reducer/Slices/authSlice";

function CaptureAudio({hide,socket}) {
  const dispatch=useDispatch();
  
  const {userInfo,currentChatUser}=useSelector((state)=> state.auth);
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState(null)
  const [isPlaying, setisPlaying] = useState(false)
  const [waveform,setWaveform]=useState(null);
  const [recordingDuration,setRecordingDuration]=useState(0);
  const [currentPlaybackTime,setCurrentPlaybackTime]=useState(0);
  const [totalDuration,setTotalDuration]=useState(0);
  const [renderedAudio,setRenderedAudio]=useState(null);
  const audioRef=useRef(null);
  const mediaRecordedRef=useRef(null);
  const waveFormRef=useRef(null)

   useEffect(()=>{
    let interval;
    if(isRecording){
      interval=setInterval(()=>{
        setRecordingDuration((prevDuration)=>{
          setTotalDuration(prevDuration+1);
          return prevDuration+1;
        })
      },1000)
    }
    return ()=>{
      clearInterval(interval);
    }
   },[isRecording])

  useEffect(()=>{
    const wavesurfer=WaveSurfer.create({
      container:waveFormRef.current,
      waveColor:"#ccc",
      progressColor:"#4a9eff",
      cursorColor:"#7ae3c3",
      barWidth:2,
      height:30,
      responsive:true
    });
    setWaveform(wavesurfer);
    wavesurfer.on("finish",()=>{
      setisPlaying(false);
    })
    return ()=>{
      wavesurfer.destroy();
    }
    },[])
    useEffect(()=>{
       if(waveform)handleStartRecording();
    },[waveform])
    const handleStartRecording=()=>{
      setRecordingDuration(0);
      setCurrentPlaybackTime(0);
      setTotalDuration(0);
      setIsRecording(true);
      navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
        const mediaRecorder=new MediaRecorder(stream);
        mediaRecordedRef.current=mediaRecorder;
        audioRef.current.srcObject=stream;

        const chunks=[];
        mediaRecorder.ondataavailable=(e)=>chunks.push(e.data);
        mediaRecorder.onstop=()=>{
          const blob=new Blob(chunks,{type:"audio/ogg;codecs=opus"});
          const audioURL=URL.createObjectURL(blob);
        const audio=new Audio(audioURL);
          setRecordedAudio(audio);
          setIsRecording(false);
          console.log
          waveform.load(audioURL);
        }
          mediaRecorder.start();
      }).catch((error)=> {
        console.log(error)
      })

    }

  const handleStopRecording=()=>{
   if(mediaRecordedRef.current && isRecording){
    mediaRecordedRef.current.stop();
    setIsRecording(false);
    waveform.stop();
    
    const audioChunks=[];
    mediaRecordedRef.current.addEventListener("dataavaible",(event)=>{
      audioChunks.push(event.data);
    })

    mediaRecordedRef.current.addEventListener("stop",()=>{
      const audioBlob=new Blob(audioChunks,{type:"audio/mp3"});
      const audioFile=new File([audioBlob],"recording.mp3");
      setRenderedAudio(audioFile);
    })
   }
  }

   useEffect(()=>{
    if(recordedAudio)
    {
      console.log(recordedAudio)
      const updatePlaybackTime=()=>{
        setCurrentPlaybackTime(recordedAudio.currentTime);
      }
      recordedAudio.addEventListener("timeupdate",updatePlaybackTime);
      return ()=>{
        recordedAudio.removeEventListener("timeupdate",updatePlaybackTime);
      }
    }
   },[recordedAudio])
  const handlePlayRecording=()=>{
    if(recordedAudio){
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setisPlaying(true);
    }
  }
 
  const handlePauseRecording=()=>{
  waveform.stop();
  recordedAudio.pause();
  setisPlaying(false)
  }
  const sendRecording=async()=>{
    try {
      const formData=new FormData();
      formData.append("audio",renderedAudio);
      const response=await axios.post(ADD_AUDIO_MESSAGE_ROUTE,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        },
        params:{
          from:userInfo.id,
          to:currentChatUser.id
        }
      });
      console.log("audio = "+response.data.newMessages);
      if(response.status === 201)
      {
          socket.emit("send-msg",{
          to:currentChatUser?.id,
          from:userInfo?.id,
          message:response.data.newMessages
        })
        dispatch(setAddMessage(response.data.newMessages));
       
      }
      await hide(false);

    } catch (error) {
      console.log(error)
    }
  }

  const formatTime=(time)=>{
    if(isNaN(time)) return "00:00";
    const minutes=Math.floor(time/60);
    const seconds=Math.floor(time%60);
    return `${minutes.toString().padStart(2,"0")}:${seconds
      .toString()
      .padStart(2,"0")}`;
  }




  return <div className="flex text-2xl w-full justify-end items-center">
    <div className="pt-1">
      <FaTrash className="text-panel-header-icon" onClick={()=> hide()}/>
    </div>
    <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
  {
    isRecording  ? 
    (<div className="text-red-500 animate-pulse 2-60 text-center">
      Recording <span>{recordingDuration}s</span>
    </div>):(
      <div>
        {
          recordedAudio && (<>
    
             { !isPlaying ? <FaPlay onClick={handlePlayRecording} /> 
              : <FaStop onClick={handlePauseRecording}/>}
          </>)
        }
      </div>
    )
  }
  <div className="w-60" ref={waveFormRef} hidden={isRecording}>
    {
      recordedAudio && 
      !isPlaying && (<span>{formatTime(currentPlaybackTime)}</span>)
    }
    {
      recordedAudio && !isPlaying && (
        <span>{formatTime(totalDuration)}</span>
      )
    }
    <audio ref={audioRef} hidden/>
    </div>
    <div className="mr-4">
      {
        !isRecording  ? (<FaMicrophone className="text-red-500 ml-auto" onClick={handleStartRecording}/>) 
        :(<FaPauseCircle className="text-red-500 ml-auto" onClick={handleStopRecording}/> )
      }
    </div>
    </div>
    <MdSend 
    className="text-panel-header-icon cursor-pointer mr-4"
    title="Send"
    onClick={sendRecording}
    />


  </div>;
}

export default CaptureAudio;
