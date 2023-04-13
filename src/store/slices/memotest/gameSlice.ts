import { IGameRoom } from "@/interfaces/GameRoom";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlayer } from "./../../../interfaces/Player";

type MemotestSlice = {
  room: IGameRoom | null;
  players: IPlayer[];
  gameReady: boolean;
  status?: string;
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  room: null,
  players: [
    {
      walletAddress: "123123123",
      isCurrentPlayer: false,
      icon: "",
    },
  ],
  gameReady: false,
};

export const gameSlice = createSlice({
  name: _name,
  initialState: _initialState,
  reducers: {
    enterRoom: (
      state,
      {
        payload,
      }: PayloadAction<{
        room: IGameRoom;
        newPlayer: IPlayer;
        isOwner: boolean;
      }>
    ) => {
      state.room = payload.room;
      state.players.push(payload.newPlayer);
      if (payload.isOwner)
        state.room.owner = payload.newPlayer.walletAddress;
    },
    createRoom: (
      state,
      {
        payload,
      }: PayloadAction<{
        room: IGameRoom;
      }>
    ) => {
      state.room = payload.room;
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.players.push(action.payload);
    },
    playersReady: (state) => {
      if (state.room) state.room.roomStatus = "ready-to-play";
    },
    changeGameState: (state) => {
      state.gameReady = !state.gameReady;
    },
    exitRoom: (state) => {
      state.room = null;
    },
    setFirstPlayer: (state) => {
      // TODO set first player randomly
      state.players[0].isCurrentPlayer = true;
    },
  },
});

export const {
  changeGameState,
  enterRoom,
  addPlayer,
  createRoom,
  playersReady,
  exitRoom,
} = gameSlice.actions;
