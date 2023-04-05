import { configureStore } from "@reduxjs/toolkit";
import { gameSlice } from "./slices/memotest";
import { roomsSlice } from "./slices/rooms/roomsSlice";
import { walletSlice } from "./slices/walletSlice";

export const store = configureStore({
  reducer: {
    wallet: walletSlice.reducer,
    memotest: gameSlice.reducer,
    rooms: roomsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
