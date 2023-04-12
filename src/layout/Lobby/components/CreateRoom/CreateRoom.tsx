import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { createGameRoom } from "@/store/slices/memotest";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./CreateRoom.module.css";
import {
  useContract,
  useProvider,
  useSocket,
} from "../../../../hooks/memotest";
import { useEffect, useState } from "react";
import { SocketEventNames } from "../../../../types/memotest/socket-event-names.enum";
import {
  ICreateRoom,
  IRoomCreated,
} from "../../../../interfaces/memotest/room.interface";
import { environment } from "../../../../environment/enviornment";
import { IGameConfig } from "../../../../interfaces/memotest/game-config.interface";
import { SocketError } from "../../../../interfaces/socket-error.interface";

interface ICreateRoomForm {
  name: string;
  isPrivate?: boolean;
  bet?: number;
}

export const CreateRoom = ({ onCreateRoom }: { onCreateRoom: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [minimumBetAmount, setMinBetAmount] = useState(0);
  const [gameBoardObjectId, setGameBoard] = useState("");

  const { walletAddress, name } = useSelector(
    (state: RootState) => state.wallet
  );

  const socket = useSocket();
  const contractService = useContract();
  const { getObjectById, getPublicKeyForSockets, getSignatureForSockets } =
    useProvider();

  useEffect(() => {
    getObjectById<IGameConfig>(environment.memotest.config).then((res) =>
      setMinBetAmount(res.minimum_bet_amount)
    );

    socket.listen(SocketEventNames.onError, handleErrors);
    socket.listen(SocketEventNames.onRoomCreated, handleRoomCreation);

    return () => {
      socket.off(SocketEventNames.onError, handleErrors);
      socket.off(SocketEventNames.onRoomCreated, handleRoomCreation);
    };
  }, [gameBoardObjectId]);

  function handleRoomCreation(data: IRoomCreated) {
    dispatch(
      createGameRoom(
        {
          isPrivate: true,
          name: data.roomId,
          type: "memotest",
          id: data.roomId + ":" + gameBoardObjectId,
        },
        {
          walletAddress:
            typeof walletAddress === "string"
              ? walletAddress
              : walletAddress[0],
          name,
        }
      )
    );

    onCreateRoom();
  }

  function handleErrors(error: SocketError) {
    alert(JSON.stringify(error));
  }

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ICreateRoomForm>();

  const onSubmit: SubmitHandler<ICreateRoomForm> = async ({ bet }) => {
    const signature = await getSignatureForSockets(socket.clientId);
    let tmpGameBoardObjectId;
    try {
      if (gameBoardObjectId == "") {
        tmpGameBoardObjectId = await contractService.createGame(bet as number);
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
    });
  };

  return (
    <article className="h-100 d-flex">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`form text-white d-flex flex-column p-4 w-75 m-auto bgGlass`}
      >
        <div className="mb-5">
          <label className="form-label">Amount to bet</label>
          <input
            placeholder="Amount to bet in SUI token"
            className={`form-control ${styles.inputStyles}`}
            type="number"
            {...register("bet", { min: minimumBetAmount, required: true })}
          />
          <small className="form-text text-warning">
            {errors?.bet && `The min value is ${minimumBetAmount}`}
          </small>
        </div>
        <input
          disabled={isSubmitting}
          value="Create Room"
          className="btn w-50 m-auto btn-primary"
          type="submit"
        />
      </form>
    </article>
  );
};
