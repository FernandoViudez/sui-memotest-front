import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { RootState } from "@/store/store";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import * as GameReducer from "../memotest";

export const enterGameRoom = (
  roomId: string,
  player: IPlayer
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const {
      memotest: { rooms },
    } = getState();

    const room = rooms.filter((r) => r.id === roomId)?.pop();

    if (!room) throw new Error("Room does not exists or it is not available");

    dispatch(
      GameReducer.enterRoom({
        newPlayer: player,
        currentRoom: room,
        isOwner: false,
      })
    );
  };
};

export const createGameRoom = (
  roomDTO: { isPrivate: boolean; name: string; type: "memotest"; id: string },
  userOwnerDTO: { walletAddress: string; name?: string }
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const newRoom: IGameRoom = {
      ...roomDTO,
      owner: userOwnerDTO.walletAddress,
      roomStatus: "pending",
      players: [],
      isAvailable: true,
    };
    dispatch(GameReducer.addRoom(newRoom));
    dispatch(
      GameReducer.enterRoom({
        currentRoom: newRoom,
        newPlayer: userOwnerDTO,
        isOwner: true,
      })
    );
  };
};
