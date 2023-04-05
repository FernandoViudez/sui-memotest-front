import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ILobby {
  lobbyStatus: "ready-to-play" | "pending";
  currentRoom: IGameRoom | null;
  connectedPlayers: IPlayer[];
}

type MemotestSlice = {
  lobby: ILobby | null;
  game?: {};
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  lobby: null,
};

export const gameSlice = createSlice({
  name: _name,
  initialState: _initialState,
  reducers: {
    enterLobby: (
      state,
      action: PayloadAction<{ room: IGameRoom; newPlayer: IPlayer }>
    ) => {
      if (!state.lobby) return;
      state.lobby.connectedPlayers.push(action.payload.newPlayer);
      state.lobby.currentRoom = action.payload.room;
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.lobby?.connectedPlayers.push(action.payload);
    },
    startGame: (state) => {
      if (state.lobby) state.lobby.lobbyStatus = "ready-to-play";
    },
    cancelGame: (state) => {
      if (state.lobby) state.lobby.lobbyStatus = "pending";
    },
    setConnectedPlayers: (
      state,
      { payload }: PayloadAction<{ walletAddress: string }>
    ) => {
      if (state.lobby?.connectedPlayers.length)
        state.lobby.connectedPlayers =
          state.lobby.connectedPlayers.filter(
            (p) => p.walletAddress !== payload.walletAddress
          );
    },
    exitLobby: (state) => {
      state.lobby = null;
    },
  },
});

export const {
  enterLobby,
  addPlayer,
  startGame,
  cancelGame,
  setConnectedPlayers,
  exitLobby,
} = gameSlice.actions;
