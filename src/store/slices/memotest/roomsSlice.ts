import { IPlayer } from "@/interfaces/Player";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IMemotestRoom {
  name: string;
  players: IPlayer[];
  isAvailable: boolean;
  id: string;
}

type RoomSlice = {
  rooms: IMemotestRoom[];
  currentRoom: IMemotestRoom | null;
};

const _initialState: RoomSlice = {
  rooms: [],
  currentRoom: null,
};

const _name: string = "rooms";

export const roomsSlice = createSlice({
  initialState: _initialState,
  name: _name,
  reducers: {
    exitFromRoom: (state) => {
      state.currentRoom = null;
    },
    setRooms: (state, action: PayloadAction<IMemotestRoom[]>) => {
      return {
        ...state,
        rooms: action.payload,
      };
    },
    createRoom: (state, action: PayloadAction<IMemotestRoom>) => {
      state.rooms.push({ ...action.payload });
      state.currentRoom = action.payload;
    },
    selectRoom: (state, action: PayloadAction<IMemotestRoom>) => {
      state.rooms.push(action.payload);
    },
    deleteRoom: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        rooms: state.rooms.filter((r) => r.id === action.payload),
      };
    },
  },
});

export const {
  exitFromRoom,
  setRooms,
  createRoom,
  selectRoom,
  deleteRoom,
} = roomsSlice.actions;
