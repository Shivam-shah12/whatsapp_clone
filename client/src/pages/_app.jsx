import "@/styles/globals.css";
import Head from "next/head";
import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "@/reducer/StateReducers";
import { Provider } from "react-redux";
// import reducer,{initialState} from '@/reducer/StateReducers.js'
// import { StateProvider } from "@/context/StateContext.jsx";
const store = configureStore({
  reducer:rootReducer,
});

export default function App({ Component, pageProps }) {
  return  (
   <>
   <Provider store = {store}>
      <Head>
        <title>Whatsapp - Clone</title>
        <link rel="shortcut icon" href="/favicon.png"/>
      </Head>
      <Component {...pageProps} />
      </Provider>
      </>


  )

}
