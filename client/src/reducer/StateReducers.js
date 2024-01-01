import authReducer from "./Slices/authSlice";
import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['socket'], // Exclude 'socket' from being persisted
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // Add other reducers here if needed
});

export default rootReducer;
