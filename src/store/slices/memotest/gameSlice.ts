import { GameStatus, GameType } from "@/enums";
import { IGameRoom } from "@/interfaces/GameRoom";
import { IGameBoard } from "@/interfaces/memotest/game-board.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPlayer } from "./../../../interfaces/Player";

type MemotestSlice = {
  publicRooms: IGameRoom[];
  currentRoom: {
    details: IGameRoom;
    players: IPlayer[];
    // gameReady: boolean;
  } | null;
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  publicRooms: [],
  currentRoom: null,
  // gameReady: false,
};

export const gameSlice = createSlice({
  name: _name,
  initialState: _initialState,
  reducers: {
    enterRoom: (
      state,
      {
        payload: { gameBoard, roomCode },
      }: PayloadAction<{
        gameBoard: IGameBoard;
        roomCode: string;
      }>
    ) => {
      state.currentRoom = {
        details: {
          id: gameBoard.id,
          isPrivate: true,
          owner: gameBoard.config.fields.creator,
          roomCode: roomCode,
          gameStatus: GameStatus.Waiting,
          type: GameType.Memotest,
        },
        players: gameBoard.players.map((p) => ({
          walletAddress: p.fields.addr,
          playerTableID: Number(p.fields.id),
          isCurrentPlayer:
            gameBoard.who_plays === Number(p.fields.id),
        })),
      };
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
        gameStatus: GameStatus.Waiting,
        roomCode: payload.roomCode,
        isPrivate: payload.isPrivate,
        type: GameType.Memotest,
        id: payload.roomCode.split(":")[0],
      };
      state.publicRooms.push(newRoom);
      state.currentRoom = {
        details: newRoom,
        players: [
          <IPlayer>{
            walletAddress: payload.ownerWalletAddress,
            isCurrentPlayer: true,
            playerTableID: 1,
          },
        ],
      };
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      console.log(action.payload);
      state.currentRoom?.players.push({
        walletAddress: action.payload?.walletAddress?.length
          ? action.payload.walletAddress
          : "unset",
      });
    },
    playersReady: (state) => {
      if (state.currentRoom?.details)
        state.currentRoom.details.gameStatus = GameStatus.Playing;
    },
    // changeGameState: (state) => {
    //   state.gameReady = !state.gameReady;
    // },
    setRooms: (state, action: PayloadAction<IGameRoom[]>) => {
      state.publicRooms = action.payload;
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
