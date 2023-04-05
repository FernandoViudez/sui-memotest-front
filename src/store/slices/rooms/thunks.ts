import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { RootState } from "@/store/store";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import * as GameReducer from "../memotest";
import * as RoomsReducer from "./roomsSlice";

export const createAGameRoom = (
  roomDTO: { isPrivate: boolean; name: string; type: "memotest" },
  player: IPlayer
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const newRoom: IGameRoom = {
      ...roomDTO,
      players: [],
      isAvailable: true,
      id: Date.now() * Math.random() * 10 + "",
    };

    dispatch(RoomsReducer.createRoom(newRoom));
    dispatch(GameReducer.enterARoomLobby(newRoom.id, player));
  };
};
