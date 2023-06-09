import { GameStatus, GameType } from "@/enums";
import { ICurrentRoom, IGameRoom } from "@/interfaces/GameRoom";
import { IGameBoard } from "@/interfaces/memotest/game-board.interface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  IPlayerJoined,
  IPlayerLeft,
} from "../../../interfaces/memotest/player.interface";
import { IPlayer } from "./../../../interfaces/Player";

type MemotestSlice = {
  publicRooms: IGameRoom[];
  currentRoom: ICurrentRoom | null;
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  publicRooms: [],
  currentRoom: null,
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
      const [id, gameboardObjectId] = roomCode.split(":");
      state.currentRoom = {
        details: {
          id,
          isPrivate: true,
          owner: gameBoard.config.fields.creator,
          gameboardObjectId,
          gameStatus: GameStatus.Waiting,
          type: GameType.Memotest,
        },
        players: gameBoard.players.map((p) => ({
          walletAddress: p.fields.addr,
          playerTableID: Number(p.fields.id),
          isCurrentPlayer:
            gameBoard.who_plays === Number(p.fields.id),
        })),
        whoPlays: gameBoard.who_plays,
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
        status?: GameStatus;
      }>
    ) => {
      const [id, gameboardObjectId] = payload.roomCode.split(":");

      const newRoom: IGameRoom = {
        owner: payload.ownerWalletAddress,
        gameStatus: GameStatus.Waiting,
        gameboardObjectId,
        isPrivate: payload.isPrivate,
        type: GameType.Memotest,
        id,
      };
      if (!payload.isPrivate) state.publicRooms.push(newRoom);
      state.currentRoom = {
        whoPlays: 1,
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
    addPlayer: (state, action: PayloadAction<IPlayerJoined>) => {
      state.currentRoom?.players.push({
        walletAddress: action.payload?.address?.length
          ? action.payload.address
          : "unset",
        playerTableID: action.payload.id,
        isCurrentPlayer: false,
      });

      state.currentRoom?.players.sort(
        (a, b) =>
          (a?.playerTableID as number) - (b?.playerTableID as number)
      );
    },
    removePlayer: (state, action: PayloadAction<IPlayerLeft>) => {
      const idx = state.currentRoom?.players.findIndex(
        (player) => player.walletAddress === action.payload.address
      );
      if (idx && idx >= 0) {
        state.currentRoom?.players.splice(idx, 1);
      }
    },
    playersReady: (state) => {
      if (state.currentRoom?.details)
        state.currentRoom.details.gameStatus = GameStatus.Playing;
    },
    setPlayerTurn: (
      state,
      action: PayloadAction<{ playerId: number }>
    ) => {
      return {
        ...state,
        currentRoom: {
          ...(state.currentRoom as any),
          players: state.currentRoom?.players.map((p) => {
            if (p.playerTableID === action.payload.playerId) {
              return {
                ...p,
                isCurrentPlayer: true,
              };
            }
            return {
              ...p,
              isCurrentPlayer: false,
            };
          }),
          whoPlays: action.payload.playerId,
        },
      };
    },
    changeGameState: (
      state,
      action: PayloadAction<{ status: GameStatus }>
    ) => {
      if (state.currentRoom) {
        return {
          ...state,
          currentRoom: {
            ...state.currentRoom,
            details: {
              ...state.currentRoom.details,
              gameStatus: action.payload.status,
            },
          },
        };
      }
      return state;
    },
    setGameFinished: (
      state,
      action: PayloadAction<{
        matchStatus: {
          status: "victory" | "withdraw";
          winners: { walletAddress: string; cardsRevealed: number }[];
          players: { walletAddress: string; cardsRevealed: number }[];
        };
      }>
    ) => {
      if (!state.currentRoom) return;
      state.currentRoom.details.gameStatus = GameStatus.Finished;
      state.currentRoom.winner = action.payload.matchStatus;
    },
    setRooms: (state, action: PayloadAction<IGameRoom[]>) => {
      state.publicRooms = action.payload;
    },
    exitRoom: (state) => {
      state.currentRoom = null;
    },
    removeRoom: (state) => {
      state.currentRoom = null;
    },
  },
});

export const {
  changeGameState,
  enterRoom,
  addPlayer,
  setPlayerTurn,
  removePlayer,
  createRoom,
  playersReady,
  setGameFinished,
  setRooms,
  exitRoom,
  removeRoom,
} = gameSlice.actions;
