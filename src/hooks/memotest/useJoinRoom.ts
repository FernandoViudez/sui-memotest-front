import { IGameBoard } from "@/interfaces/memotest/game-board.interface";
import { IPlayerJoined } from "@/interfaces/memotest/player.interface";
import { IJoinRoom } from "@/interfaces/memotest/room.interface";
import { AppDispatch } from "@/store";
import { enterRoom } from "@/store/slices/memotest";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useContract, useProvider, useSocket } from "./index";

export const useJoinRoom = ({
  onJoinRoom,
}: {
  onJoinRoom: () => void;
}) => {
  const [roomCode, setRoomCode] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {
    getPublicKeyForSockets,
    getSignatureForSockets,
    getObjectById,
  } = useProvider();
  const socket = useSocket(Namespace.memotest);
  const contractService = useContract();

  const onJoinedRoom = useCallback(
    async (data: IPlayerJoined) => {
      console.log("Player joined ~> ", data.id);
      const { data: gameBoard } = await getObjectById<IGameBoard>(
        roomCode.split(":")[1]
      );
      dispatch(enterRoom({ gameBoard, roomCode }));
      onJoinRoom();
    },
    [dispatch, getObjectById, onJoinRoom, roomCode]
  );

  useEffect(() => {
    socket.listen(SocketEventNames.onPlayerJoined, onJoinedRoom);
    return () => {
      socket.off(SocketEventNames.onPlayerJoined, onJoinedRoom);
    };
  });

  const joinRoom = async (roomCode: string) => {
    setRoomCode(roomCode);
    const [roomId, gameId] = roomCode.split(":");
    const bet = await getObjectById<IGameBoard>(gameId);
    const signature = await getSignatureForSockets(
      socket.clientId as string
    );
    await contractService.joinRoom(
      gameId,
      bet.data.config.fields.minimum_bet_amount as number
    );
    socket.emit<IJoinRoom>(SocketEventNames.joinRoom, {
      publicKey: getPublicKeyForSockets(),
      signature,
      roomId,
    });
  };

  return { joinRoom };
};
