import { createSlice } from "@reduxjs/toolkit";

export const shopSlice = createSlice({
  name: "shop",
  initialState: {
    status: null as number | null,
  },
  reducers: {
    setShopStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setShopStatus } = shopSlice.actions;
export default shopSlice.reducer;
