import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaStop } from "react-icons/fa";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import Avatar from "../common/Avatar";

function VoiceMessage({ message }) {
  const { userInfo, currentChatUser } = useSelector((state) => state.auth);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setisPlaying] = useState(false);
  const [waveform, setWaveform] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [renderedAudio, setRenderedAudio] = useState(null);
  const audioRef = useRef(null);
  const mediaRecordedRef = useRef(null);
  const waveFormRef = useRef(null);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveFormRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveform(wavesurfer);
    wavesurfer.on("finish", () => {
      setisPlaying(false);
    });
    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    const audioURL = `${HOST}/${message.message}`;
    const audio = new Audio(audioURL);
    setRecordedAudio(audio);
    if (waveform) {
      waveform.load(audioURL);

      waveform.on("ready", () => {
        setTotalDuration(waveform.getDuration());
      });

      waveform.on("finish", () => {
        setisPlaying(false);
        waveform.seekTo(0);
      });
    }
    return () => {
      if (waveform) {
        waveform.empty(); // Clear the waveform when switching to a new audio file
      }
    };
  }, [message.message]);

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const handlePlayAudio = () => {
    if (recordedAudio) {
      setisPlaying(true);
      recordedAudio.play();
      waveform.play();
    }
  };

  const handlePauseAudio = () => {
    setisPlaying(false);
    recordedAudio.pause();
    waveform.pause();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-md ${message.senderId === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
      <div>
        <Avatar type="lg" image={currentChatUser?.profilePicture} />
      </div>
      <div className="relative cursor-pointer text-xl">
        {recordedAudio && (isPlaying ? <FaStop onClick={handlePauseAudio} className="cursor-pointer" /> : <FaPlay onClick={handlePlayAudio} className="cursor-pointer" />)}
      </div>
      <div className="relative">
        <div className="w-60" ref={waveFormRef} />

        <div className="text-bubble-meta text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>{formatTime(isPlaying ? currentPlaybackTime : totalDuration)}</span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createAt)}</span>
            {message.senderId === userInfo.id && <MessageStatus messageStatus={message.messageStatus} />}
          </div>
          <audio ref={audioRef} src={recordedAudio} className="w-60" />
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;
