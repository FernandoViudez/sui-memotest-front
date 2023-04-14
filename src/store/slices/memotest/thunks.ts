// import { IGameRoom } from "@/interfaces/GameRoom";
// import { IPlayer } from "@/interfaces/Player";
// import { RootState } from "@/store/store";
// import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
// import * as GameReducer from "../memotest";

// export const enterGameRoom = (
//   roomCode: string,
//   player: IPlayer
// ): ThunkAction<void, RootState, unknown, AnyAction> => {
//   return async (dispatch, getState) => {
//     const {
//       memotest: { room },
//       wallet: { walletAddress },
//     } = getState();

//     // Destructure room code
//     const [roomId, objectId] = roomCode.split(":");

//     // get room from provider
//     const room = mock.getRoom

//     // call contract provider
//     const resp = <IGameRoom>{
//       roomCode: ,
//       id: "",
//       isAvailable: false,
//       isPrivate: true,
//       owner: "",
//       roomStatus: "pending",
//       type: "memotest",
//     };
//     // send sockket msg with the new player

//     // enter room state

//     if (!room)
//       throw new Error("Room does not exists or it is not available");

//     dispatch(
//       GameReducer.enterRoom({
//         newPlayer: player,
//         isOwner: walletAddress === room.owner,
//         room: resp,
//       })
//     );
//   };
// };
