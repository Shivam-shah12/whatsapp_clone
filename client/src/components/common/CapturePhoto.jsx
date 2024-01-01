import React, { useEffect, useRef } from 'react';
import { FaBeer } from 'react-icons/fa';

function CapturePhoto({ hide, setImage }) {
  const videoRef = useRef(null);

  useEffect(() => {
    console.log("yes");
    let stream;

    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      videoRef.current.srcObject = stream;
    };

    startCamera();

    return () => {
      const tracks = stream?.getTracks();
      tracks && tracks.forEach((track) => track.stop());
    };
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match video dimensions
    canvas.width = 400;
    canvas.height = 300;

    ctx.drawImage(videoRef.current, 0, 0, 400, 300);
    setImage(canvas.toDataURL("image/jpeg"));
    hide(false);
  };

  return (
    <div className="absolute h-[4/6] w-[2/6] top-[1/4] bottom-3 left-[1/3] bg-gray-900">
      <div className="flex flex-col gap-4 w-full">
        <div
          className="pt-2 pr-2 cursor-pointer flex items-end justify-end"
          onClick={() => hide(false)}
        >
          <FaBeer className="h-5 w-5 cursor-pointer text-white" />
        </div>
        <div className="flex justify-center z-10">
          <video id="video" width={400} height={300} autoPlay ref={videoRef}></video>
        </div>
        <button
          className="h-12 w-12 bg-white rounded-full cursor-pointer border m-auto hover:bg-red-400"
          onClick={capturePhoto}
        ></button>
      </div>
    </div>
  );
}

export default CapturePhoto;
