import { IPlayer } from "@/interfaces/Player";
import { RootState } from "@/store/store";
import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { enterLobby } from "./gameSlice";

export const enterARoomLobby = (
  roomId: string,
  player: IPlayer
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return (dispatch, getState) => {
    const { rooms } = getState();

    const room = rooms.filter((r) => r.id === roomId)?.pop();

    if (!room)
      throw new Error("Room does not exists or it is not available");

    dispatch(
      enterLobby({
        newPlayer: player,
        room,
      })
    );
  };
};
