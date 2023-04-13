import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { RootState } from "@/store/store";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import * as GameReducer from "../memotest";

export const enterGameRoom = (
  roomCode: string,
  player: IPlayer
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const {
      memotest: { room },
      wallet: { walletAddress },
    } = getState();

    // Destructure room code
    const objectId = roomCode.split(":");
    // call contract provider
    const resp = <IGameRoom>{
      id: "",
      isAvailable: false,
      isPrivate: true,
      owner: "",
      roomCode: "",
      roomStatus: "pending",
      type: "memotest",
    };
    // send sockket msg with the new player
    // enter room state

    if (!room)
      throw new Error("Room does not exists or it is not available");

    dispatch(
      GameReducer.enterRoom({
        newPlayer: player,
        isOwner: walletAddress === room.owner,
        room: resp,
      })
    );
  };
};

export const createGameRoom = (
  roomCode: string
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const { wallet } = getState();

    const newRoom: IGameRoom = {
      owner: wallet.walletAddress,
      roomStatus: "pending",
      isAvailable: true,
      roomCode,
      isPrivate: true,
      type: "memotest",
      id: "", // Room Code id?
    };

    // set socket msg to create room
    // ...

    // set room in state
    dispatch(GameReducer.createRoom({ room: newRoom }));

    // send sockket msg with the new player
    // ...

    // enter room state
    dispatch(
      GameReducer.enterRoom({
        room: newRoom,
        newPlayer: {
          walletAddress: wallet.walletAddress,
        },
        isOwner: true,
      })
    );
  };
};
