import { IPlayerJoined } from "@/interfaces/memotest/player.interface";
import { IJoinRoom } from "@/interfaces/memotest/room.interface";
import { AppDispatch } from "@/store";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useContract, useProvider, useSocket } from "./index";

export const useJoinRoom = ({
  onJoinRoom,
}: {
  onJoinRoom: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { getPublicKeyForSockets, getSignatureForSockets } =
    useProvider();
  const socket = useSocket(Namespace.memotest);
  const contractService = useContract();

  const onJoinedRoom = useCallback((data: IPlayerJoined) => {
    console.log("Player joined ~> ", data.id);
    // TODO: Fix data flow before changing screen
    // dispatch(enterGameRoom(data.roomCode, { walletAddress }));
    // onJoinRoom();
  }, []);

  useEffect(() => {
    socket.listen(SocketEventNames.onPlayerJoined, onJoinedRoom);
    return () => {
      socket.off(SocketEventNames.onPlayerJoined, onJoinedRoom);
    };
  });

  const joinRoom = async (roomCode: string, bet: number) => {
    const [roomId, gameId] = roomCode.split(":");
    const signature = await getSignatureForSockets(
      socket.clientId as string
    );
    await contractService.joinRoom(gameId, bet as number);
    socket.emit<IJoinRoom>(SocketEventNames.joinRoom, {
      publicKey: getPublicKeyForSockets(),
      roomId: roomId,
      signature,
    });
  };

  return { joinRoom };
};
