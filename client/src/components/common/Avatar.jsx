import React from "react";
import Image from "next/image";
import { useState } from "react";
import {FaCamera} from 'react-icons/fa'
import ContextMenu from './ContextMenu.jsx'
import { useEffect } from "react";
import PhotoPicker from "./PhotoPicker.jsx";
import PhotoLibrary from "./PhotoLibrary.jsx";
import CapturePhoto from "./CapturePhoto.jsx";
function Avatar({type,image,setImage}) {
  const [hover,setHover]=useState(false);
  const [isContextMenuVisible,setIsContextMenuVisible]=useState(false);
  const [contextMenuCoordinates,setcontextMenuCoordinates]=useState({
    x:0,y:0
  })
  const showContextMenu=(e)=>{
    e.preventDefault();
    setIsContextMenuVisible(true);
    setcontextMenuCoordinates({x:e.pageX,y:e.pageY});
}
  const [grapPhoto,setGrabPhoto]=useState(false);
  const [showPhotoLibrary,setShowPhotoLibrary]=useState(false);
  const [capturedPhoto,setShowCapturedPhoto]=useState(false);
 
  const showContextMenuOption = [
    { name: 'Take photo', callback: () => {
      setShowCapturedPhoto(true)
    } },
    { name: 'Choose From Library', callback: () => {
      setShowPhotoLibrary(true)
    } },
    { name: 'Upload Photo', callback: () => {
      setGrabPhoto(true)
    } },
    { name: 'Remove Photo', callback: () => {
      setImage("/default_avatar.png")
    } },
  ];
 
  useEffect(()=>{
    if(grapPhoto)
    {
      const data=document.getElementById("photo-picker")
      data.click();
      document.body.onfocus =(e)=>{
        setTimeout(()=>{
          setGrabPhoto(false);
        },1000);
      }
    }
  },[grapPhoto])
  const photoPickerChange=async(e)=>{
     console.log(e);
     const file=e.target.files[0];
     const reader=new FileReader();
     console.log(file)
     const data=document.createElement("img");
     reader.onload=function (event){
      data.src=event.target.result;
      data.setAttribute("data-src",event.target.result);
     }
     reader.readAsDataURL(file);
     setTimeout(()=>{
      console.log(data.src);
      setImage(data.src);
     },100);
  };
  return (
     <>
     <div className="flex relative cursor-pointer" >
        {
        type==="sm" && 
        <div className="relative cursor-pointer z-0">
        <div className={` h-14 w-14 `}>
           <Image src={image} className="rounded-full" fill/>
        </div>
        </div>
       }
        {
        type==="lg" && 
        <div className="relative cursor-pointer z-0">
    <div className={`h-14 w-14  `}>   
     <Image src={image} className="rounded-full" fill/>
        </div>
        </div>
       } 
        {
        type==="xl" && 
        <div className="relative cursor-pointer z-0" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>

          <div className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 
          rounded-full flex items-center justify-center flex-col text-center gap-2 ${hover ? "visible" : "hidden"}`}
          onClick={e => showContextMenu(e)} id="context-opener"
          >
            <FaCamera className="text-2xl text-white" id="context-opener"  onClick={e => showContextMenu(e)}/>
            <span className="text-white" id="context-opener" onClick={e => showContextMenu(e)}>Choose your Photo</span>
          </div>
        <div className="h-60 w-60"  onClick={e => showContextMenu(e)}>
           <Image src={image} className="rounded-full" fill/>
        </div>
        </div>
       }
       
      </div> 
      {
            isContextMenuVisible && <ContextMenu options={showContextMenuOption} 
            coordinates={contextMenuCoordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
            />
        }
        {
          grapPhoto && <PhotoPicker onChange={photoPickerChange}/> 
        }
        {
          showPhotoLibrary && 
            <PhotoLibrary
             setImage={setImage} 
             hidePhotoLibrary={setShowPhotoLibrary}
            />
        }
       {
         capturedPhoto && <CapturePhoto  setImage={setImage} hide={setShowCapturedPhoto} />
       }
      
 
     </>
  );
}

export default Avatar;