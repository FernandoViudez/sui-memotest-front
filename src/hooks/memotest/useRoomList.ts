import { IGameRoom } from "@/interfaces/GameRoom";
import { IRoomResponse } from "@/interfaces/memotest/room.interface";
import { AppDispatch, RootState } from "@/store";
import { setRooms } from "@/store/slices/memotest";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useJoinRoom } from "./useJoinRoom";
import { useSocket } from "./useSocket";

export const useRoomList = ({
  onSelectRoom,
}: {
  onSelectRoom: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    memotest: { publicRooms },
    wallet: { walletAddress, name },
  } = useSelector((state: RootState) => state);
  const socket = useSocket(Namespace.memotest);
  const { joinRoom } = useJoinRoom({ onJoinRoom: onSelectRoom });

  const handleGetRooms = useCallback(
    (rooms: string) => {
      const publicRooms = (JSON.parse(rooms) as IRoomResponse[]).map(
        ({ id, code, owner, status, isPrivate, playersInRoom }) =>
          ({
            gameboardObjectId: code.split(":")[1],
            gameStatus: status,
            type: "memotest",
            playersInRoom,
            isPrivate,
            owner,
            id,
          } as IGameRoom)
      );
      dispatch(setRooms(publicRooms));
    },
    [dispatch]
  );

  useEffect(() => {
    socket.listen(SocketEventNames.onGetRooms, handleGetRooms);
    return () => {
      socket.off(SocketEventNames.onGetRooms, handleGetRooms);
    };
  }, [handleGetRooms, socket]);

  useEffect(() => {
    socket.emit(SocketEventNames.getRooms);
  }, [handleGetRooms, socket]);

  return {
    publicRooms,
    joinRoom,
  };
};
