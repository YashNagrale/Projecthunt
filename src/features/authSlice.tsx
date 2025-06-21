import { createSlice } from "@reduxjs/toolkit";

interface AuthValues {
  status: boolean;
  userData: object | null;
}

const initialState: AuthValues = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

export default authSlice.reducer;

export const { login, logout } = authSlice.actions;
