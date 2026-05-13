import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./login/authSlice";
import userSlice from "./user/userSlice";
import contractSlice from "./finance/contractSlice";
import setmealSlice from "./setmeal/setmealSlice";
import shopSlice from "./shop/shopSlice";
export const store = configureStore({
  reducer: {
    authSlice: authSlice,
    userSlice: userSlice,
    contractSlice: contractSlice,
    setmealSlice: setmealSlice,
    shopSlice: shopSlice,
  },
});
