import { IGameRoom } from "@/interfaces/GameRoom";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const _initialState: IGameRoom[] = [];

const _name: string = "rooms";

export const roomsSlice = createSlice({
  initialState: _initialState,
  name: _name,
  reducers: {
    setRooms: (state, action: PayloadAction<IGameRoom[]>) => {
      return [...action.payload];
    },
    createRoom: (state, action: PayloadAction<IGameRoom>) => {
      state.push({ ...action.payload }); // TODO: implement thunk that connects with memoGameSlice
    },
    deleteRoom: (state, action: PayloadAction<string>) => {
      return state.filter((r) => r.id === action.payload);
    },
  },
});

export const { setRooms, createRoom, deleteRoom } =
  roomsSlice.actions;
