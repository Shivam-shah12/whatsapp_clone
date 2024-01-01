import React from "react";
import Image from "next/image";
import Input from "@/components/common/Input";
import { useSelector ,useDispatch} from 'react-redux';
import {useState} from 'react'
import Avatar from "@/components/common/Avatar";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { setNewUser ,setUser} from "@/reducer/Slices/authSlice";
import { useRouter } from "next/router";
import axios from "axios";
function onboarding() {
  const router=useRouter();
  const dispatch=useDispatch();
  const userInfo=useSelector((state)=> state.auth.userInfo)
  const [name,setName]=useState(userInfo?.name || "");
  const [about,setAbout]=useState("");
  const [image,setImage]=useState("/default_avatar.png")
 
  const onboardingHandler=async()=>{
    if(validateDetail())
    {
      const email=userInfo?.email;
      try {
        const {data}=await axios.post(ONBOARD_USER_ROUTE,{
          email,name,about,image
        })
        console.log("after calling api")
        console.log(data);
        if(data.status)
        {
          dispatch(setNewUser(false));
          const userInfo={
            name,about,profilePicture:image,status:about
          }
          dispatch(setUser(userInfo));
          router.push("/")
        }
      } catch (error) {
        console.log(error)
        router.push("/onboarding")
      }
    }
  }
  const validateDetail=()=>{
    if(!name || !image)
    {
      return false;
    }
    console.log(name+" "+about)
    return true;
  }
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
    <div className="flex items-center justify-center gap-2 text-white">
      <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300}/>
      <span className="text-7xl">Whatsapp</span>
    </div>
    <h2 className="text-2xl gap-6 text-white">Create your Profile</h2>
    <div className="flex gap-6">
      <div className="flex flex-col items-center justify-center mt-5 gap-6">
        <Input name="Display Name" state={name} setState={setName} label={true}/>
        <Input name="About" state={about} setState={setAbout} label={true}/>
        <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-2 rounded-lg" onClick={onboardingHandler}>
      <span className="text-white text-xl ">Create Profile</span>
    </button>
      </div>
      <div className="flex justify-center items-center relative mt-5 gap-6">
        <Avatar type="xl" image={image} setImage={setImage}/>
      </div>
    </div>

    </div>
  );
}

export default onboarding;
