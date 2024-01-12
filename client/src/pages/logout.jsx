import React, { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setUser } from "@/reducer/Slices/authSlice";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/utils/FirebaseConfig";

function logout() {
  const {socket,userInfo}=useSelector((state)=> state.auth)
  const dispatch=useDispatch()
  const router=useRouter();
  useEffect(()=>{
    dispatch(setUser(undefined))
    signOut(firebaseAuth)
    router.push("/login");
  })
  return <div className="bg-conversation-panel-background"></div>;
}

export default logout;
