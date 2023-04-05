import { configureStore } from "@reduxjs/toolkit";
import { gameSlice } from "./slices/memotest";
import { walletSlice } from "./slices/walletSlice";

export const store = configureStore({
  reducer: {
    wallet: walletSlice.reducer,
    memotest: gameSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
