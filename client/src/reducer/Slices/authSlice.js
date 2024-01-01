import {createSlice} from "@reduxjs/toolkit";

const initialState={
   userInfo:undefined,
   newUser:false,
   iscontactsPage:false,
   currentChatUser:undefined,
   allMessage:[],
   socket:undefined,
   messageSearch:false,
   userContacts:[],
   filteredContacts:[],
   videoCall:undefined,
   voiceCall:undefined,
   incomingVoiceCall:undefined,
   incomingVideoCall:undefined
}
const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
      setUser(state, value) {
        state.userInfo = value.payload;
      },
      setNewUser(state, value) {
        state.newUser = value.payload;
      },
      setContactPage(state, value) {
        // Assuming value.payload contains the new value you want to add
        state.iscontactsPage = value.payload;
      },
      setCurrentChatUser(state, value) {
        state.currentChatUser = value.payload;
      },
      setAllMessage(state, value) {
        // Assuming value.payload is an array of messages
        if (Array.isArray(value.payload)) {
          state.allMessage = [...value.payload];
        }
      },
      setSocket(state, action) {
        state.socket = action.payload; // Assuming id is a property you need
      },
      setAddMessage(state,value){
        state.allMessage=[...state.allMessage,value.payload];
      },
      setMessageSearch(state,value){
        state.messageSearch=value.payload;
      },
      setUserContacts(state,value){
        if (Array.isArray(value.payload)) {
          state.userContacts = [...value.payload];
        }
      },
      setContactSearch(state, value) {
        const contactSearch = value.payload;
        const filteredContacts = state.userContacts.filter((contact) =>
          contact.name.toLowerCase().includes(contactSearch.toLowerCase())
        );
        return { ...state, filteredContacts };
      },
      setVideoCall(state, value) {
        return {
          ...state,
          videoCall: value.payload, // Use value.payload instead of action.videoCall
        };
      },
      setVoiceCall(state,value){
       return {
        ...state,
        voiceCall:value.payload,
       }
      },
      setIncomingVoiceCall(state,value){
        return {
          ...state,
          incomingVoiceCall:value.payload,
         }
      },
      setIncomingVideoCall(state,value){
        return {
          ...state,
          incomingVideoCall:value.payload,
         }
      },
      setEndCall(state,value){
        return {
          ...state,
          voiceCall:undefined,
          videoCall:undefined,
          incomingVideoCall:undefined,
          incomingVoiceCall:undefined
        }
      },
      setExitChat(state,value){
        return {
          ...state,
          currentChatUser:undefined
        }
      }
      

    },
  });
  
  export const {
    setUser,
    setNewUser,
    setContactPage,
    setCurrentChatUser,
    setAllMessage,
    setSocket,
    setAddMessage,
    setMessageSearch,
    setUserContacts,
    setContactSearch,
    setVideoCall,
    setVoiceCall,
    setIncomingVoiceCall,
    setIncomingVideoCall,
    setEndCall
  } = authSlice.actions;
  
  export default authSlice.reducer;
  