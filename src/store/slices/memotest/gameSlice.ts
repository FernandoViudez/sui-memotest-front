import { IPlayer } from "@/interfaces/Player";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IMemotestRoom {
  name: string;
  players: IPlayer[];
  isAvailable: boolean;
  id: string;
}

interface IRoom {
  rooms: IMemotestRoom[];
}

interface ILobby {
  connectedPlayers: IPlayer[];
  lobbyStatus: "ready-to-play" | "pending";
  roomDetails: IMemotestRoom;
}

type MemotestSlice = {
  lobby: ILobby | null;
  rooms: IRoom[];
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  connectedPlayers: [],
  lobbyStatus: "pending",
  currentRoom: null,
  rooms: [],
};

export const gameSlice = createSlice({
  name: _name,
  initialState: _initialState,
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

export const {} = gameSlice.actions;
