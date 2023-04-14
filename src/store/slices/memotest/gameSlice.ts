import { GameStatus, GameType } from "@/enums";
import { IGameRoom } from "@/interfaces/GameRoom";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlayer } from "./../../../interfaces/Player";

type MemotestSlice = {
  rooms: IGameRoom[];
  currentRoom: {
    details: IGameRoom;
    players: IPlayer[];
    // gameReady: boolean;
  } | null;
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  rooms: [],
  currentRoom: null,
  // gameReady: false,
};

/**
 * Traer rooms en join room o si las tenemos listadas al comienzo buscarlas en el store
 *
 *
 */

export const gameSlice = createSlice({
  name: _name,
  initialState: _initialState,
  reducers: {
    enterRoom: (
      state,
      {
        payload,
      }: PayloadAction<{
        details: IGameRoom;
        players: IPlayer[];
      }>
    ) => {
      state.currentRoom = payload;
    },

    createRoom: (
      state,
      {
        payload,
      }: PayloadAction<{
        roomCode: string;
        ownerWalletAddress: string;
        isPrivate: boolean;
      }>
    ) => {
      const newRoom: IGameRoom = {
        owner: payload.ownerWalletAddress,
        roomStatus: GameStatus.Waiting,
        roomCode: payload.roomCode,
        isPrivate: payload.isPrivate,
        type: GameType.Memotest,
        id: payload.roomCode.split(":")[0],
      };

      state.rooms.push(newRoom);
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.currentRoom?.players.push(action.payload);
    },
    playersReady: (state) => {
      if (state.currentRoom?.details)
        state.currentRoom.details.roomStatus = GameStatus.Playing;
    },
    // changeGameState: (state) => {
    //   state.gameReady = !state.gameReady;
    // },
    setRooms: (state, action: PayloadAction<IGameRoom[]>) => {
      state.rooms = action.payload;
    },
    exitRoom: (state) => {
      state.currentRoom = null;
    },
  },
});

export const {
  // changeGameState,
  enterRoom,
  addPlayer,
  createRoom,
  playersReady,
  setRooms,
  exitRoom,
} = gameSlice.actions;
