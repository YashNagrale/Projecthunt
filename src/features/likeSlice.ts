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
        state[projectId] = {
          count: 1,
          hasLiked: true,
        };
      }
    },
  },
});

export const { toggleLike } = likeSlice.actions;
export default likeSlice.reducer;
