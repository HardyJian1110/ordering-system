import { createSlice } from "@reduxjs/toolkit";
export const setmealSlice = createSlice({
  name: "setmeal",
  initialState: {
    setmealData: {},
  },
  reducers: {
    setSetmealData: (state, action) => {
      state.setmealData = action.payload;
    },
  },
});

export const { setSetmealData } = setmealSlice.actions;
export default setmealSlice.reducer;
