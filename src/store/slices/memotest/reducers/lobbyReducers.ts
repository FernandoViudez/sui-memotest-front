import { IPlayer } from "@/interfaces/Player";
import { PayloadAction } from "@reduxjs/toolkit";

export const addPlayer = (
  state: WritableDra<RoomSlice>,
  action: PayloadAction<IPlayer>
) => {
  state.connectedPlayers.push(action.payload);
};
// startGame: (state) => {
//   state.lobbyStatus = "ready-to-play";
// },
// cancelGame: (state) => {
//   state.lobbyStatus = "pending";
// },
// exitLobby: (
//   state,
//   { payload }: PayloadAction<{ walletAddress: string }>
// ) => {
//   state.connectedPlayers = state.connectedPlayers.filter(
//     (p) => p.walletAddress !== payload.walletAddress
//   );
// },
