import { createSlice } from "@reduxjs/toolkit";

interface UserData {
  $id: string;
  name: string;
  email?: string;
}
interface AuthValues {
  status: boolean;
  userData: UserData | null;
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
