import { IPlayer } from "@/interfaces/Player";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type LobbySlice = {
  connectedPlayers: IPlayer[];
  lobbyStatus: "ready-to-play" | "pending";
};

const _name = "lobby";

const _initialState: LobbySlice = {
  connectedPlayers: [],
  lobbyStatus: "pending",
};

export const lobbySlice = createSlice({
  name: _name,
  initialState: _initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.connectedPlayers.push(action.payload);
    },
    startGame: (state) => {
      state.lobbyStatus = "ready-to-play";
    },
    cancelGame: (state) => {
      state.lobbyStatus = "pending";
    },
    exitLobby: (
      state,
      { payload }: PayloadAction<{ walletAddress: string }>
    ) => {
      state.connectedPlayers = state.connectedPlayers.filter(
        (p) => p.walletAddress !== payload.walletAddress
      );
    },
  },
});

export const { addPlayer, startGame, cancelGame, exitLobby } =
  lobbySlice.actions;
