import { createSlice } from "@reduxjs/toolkit";

type LikeState = {
  [projectId: string]: {
    count: number;
    hasLiked: boolean;
  };
};

const initialState: LikeState = {};

const likeSlice = createSlice({
  name: "like",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { projectId } = action.payload;
      const existing = state[projectId];
      if (existing) {
        existing.hasLiked = !existing.hasLiked;
        existing.count += existing.hasLiked ? 1 : -1;
      } else {
        state[projectId] = { count: 1, hasLiked: true };
      }
    },
    setLikeState: (state, action) => {
      const { projectId, hasLiked, count } = action.payload;
      state[projectId] = { hasLiked, count };
    },
    setLikes: (state, action) => {
      return action.payload;
    },
  },
});

export const { toggleLike, setLikes, setLikeState } = likeSlice.actions;
export default likeSlice.reducer;
