import { configureStore } from "@reduxjs/toolkit";
import { walletSlice } from "./slices/walletSlice";

export const store = configureStore({
  reducer: {
    wallet: walletSlice.reducer,
    // memotest
  },
});
