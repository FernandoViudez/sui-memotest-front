import { environment } from "@/environment/enviornment";
import { IGameConfig } from "@/interfaces/memotest/game-config.interface";
import {
  ICreateRoom,
  IRoomCreated,
} from "@/interfaces/memotest/room.interface";
import { AppDispatch } from "@/store";
import * as GameReducer from "@/store/slices/memotest/gameSlice";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useContract } from "./useContract";
import { useProvider } from "./useProvider";
import { useSocket } from "./useSocket";

export const useCreateRoom = ({
  walletAddress,
  onCreateRoom,
}: {
  walletAddress: string;
  onCreateRoom: () => void;
}) => {
  const [minBetAmount, setMinimumBetAmount] = useState(0);
  const dispatch = useDispatch<AppDispatch>();
  const [gameBoardObjectId, setGameBoard] = useState("");
  const socket = useSocket(Namespace.memotest);
  const contractService = useContract();
  const {
    getObjectById,
    getPublicKeyForSockets,
    getSignatureForSockets,
  } = useProvider();

  const getMinBetAmount = useCallback(async () => {
    const { minimum_bet_amount } = await getObjectById<IGameConfig>(
      environment.memotest.config
    );
    setMinimumBetAmount(minimum_bet_amount);
  }, [getObjectById]);

  useEffect(() => {
    getMinBetAmount();
  }, [getMinBetAmount]);

  const handleRoomCreation = useCallback(
    (data: IRoomCreated) => {
      dispatch(
        GameReducer.createRoom({
          roomCode: data.roomId + ":" + gameBoardObjectId,
          ownerWalletAddress: walletAddress,
          isPrivate: true, // TODO: define how to get if the room is private or not
        })
      );
      onCreateRoom();
    },
    [dispatch, gameBoardObjectId, onCreateRoom, walletAddress]
  );

  useEffect(() => {
    socket.listen(SocketEventNames.onRoomCreated, handleRoomCreation);
    return () => {
      socket.off(SocketEventNames.onRoomCreated, handleRoomCreation);
    };
  }, [gameBoardObjectId, handleRoomCreation, socket]);

  const createRoom = async (bet: number) => {
    const signature = await getSignatureForSockets(
      socket.clientId as string
    );
    let tmpGameBoardObjectId;
    try {
      if (gameBoardObjectId == "") {
        tmpGameBoardObjectId = await contractService.createGame(bet);
        setGameBoard(tmpGameBoardObjectId);
      }
    } catch (error) {
      setGameBoard("");
      return alert(error);
    }
    socket.emit<ICreateRoom>(SocketEventNames.createRoom, {
      gameBoardObjectId: tmpGameBoardObjectId as string,
      publicKey: getPublicKeyForSockets(),
      signature,
      // TODO: ask if you can add prop is private as a parameter for this message
    });
  };

  return {
    createRoom,
    minBetAmount,
  };
};
