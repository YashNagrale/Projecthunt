import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import likeSlice from "../features/likeSlice";
const store = configureStore({
  reducer: {
    auth: authSlice,
    like: likeSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
