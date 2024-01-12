import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes';
import { firebaseAuth } from '@/utils/FirebaseConfig';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Image from 'next/image'
import React from "react";
import { useRouter } from 'next/router';
import axios from 'axios';
import {FcGoogle} from 'react-icons/fc'
import { reducerCases } from '@/reducer/constants.js';
import { useDispatch } from 'react-redux';
import { setNewUser, setUser } from '@/reducer/Slices/authSlice';

function login() {
  const router=useRouter();
  const dispatch=useDispatch();
  const handleLogin=async ()=>{
   const provider=new GoogleAuthProvider();
  const {user}=await signInWithPopup(firebaseAuth,provider);
  //  console.log(user.email + " "+user.displayName+" "+user.photoURL);
   try {
     if(user.email)
     {
      console.log(user.email)
      const email=user.email
        const data=await axios.post(CHECK_USER_ROUTE,{email});
        console.log(data);
        // agar data.success = false hai iska mtlb vo data hamare db me nahi
        // toh iska mtlb newUser aya hai --> toh hum usse onboarding page par bhej denge
        if(!data.status)
        {
          // dispatch({type:reducerCases.SET_NEW_USER,newUser:true})
          dispatch(setNewUser(true));
          const userInfo={
            name:"",about:"",photoImage:"",email:user.email
          }
          dispatch(setUser(userInfo));
          console.log(userInfo);
          router.push("/onboarding");
        }
        else
        {
          dispatch(setUser(data?.data.data))
          router.push("/")
        }
     }
   } catch (error) {
    console.log(error)
   }
  }
  return (
  <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
    <div className="flex items-center justify-center gap-2 text-white">
      <Image src="/whatsapp.gif" alt="Whatsapp" height={300} width={300}/>
      <span className="text-7xl">Whatsapp</span>
    </div>
    <button className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg" onClick={handleLogin}>
      <FcGoogle className="text-4xl"/>
      <span className="text-white text-2xl ">Login with Google</span>
    </button>
  </div>
  );
}

export default login;
