import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  useContract,
  useProvider,
  useSocket,
} from "../../../../hooks/memotest";
import { IGameBoard } from "../../../../interfaces/memotest/game-board.interface";
import { IPlayerJoined } from "../../../../interfaces/memotest/player.interface";
import { IJoinRoom } from "../../../../interfaces/memotest/room.interface";
import { SocketEventNames } from "../../../../types/memotest/socket-event-names.enum";
import { Namespace } from "../../../../types/socket-namespaces.enum";

interface IJoinRoomForm {
  roomCode: string;
  bet: number;
}
export const RoomList = ({
  onJoinRoom,
}: {
  onJoinRoom: () => void;
}) => {
  const {
    memotest: { publicRooms },
    wallet: { walletAddress, name },
  } = useSelector((state: RootState) => state);
  const [roomCode, setRoomCode] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const {
    getObjectById,
    getPublicKeyForSockets,
    getSignatureForSockets,
  } = useProvider();
  const socket = useSocket(Namespace.memotest);
  const contractService = useContract();

  useEffect(() => {
    socket.listen(SocketEventNames.onPlayerJoined, onPlayerJoined);
    return () => {
      socket.off(SocketEventNames.onPlayerJoined, onPlayerJoined);
    };
  }, []);

  function onPlayerJoined(data: IPlayerJoined) {
    console.log("Player joined ~> ", data.id);
    // TODO: Fix data flow before changing screen
    // dispatch(enterGameRoom(roomCode, { walletAddress, name }));
    // onJoinRoom();
  }

  const onSubmit: SubmitHandler<IJoinRoomForm> = async (form) => {
    setRoomCode(form.roomCode);
    const [roomId, gameId] = form.roomCode.split(":");
    const board = await getObjectById<IGameBoard>(gameId);
    const signature = await getSignatureForSockets(
      socket.clientId as string
    );
    await contractService.joinRoom(
      gameId,
      board?.config?.fields?.minimum_bet_amount
    );
    socket.emit<IJoinRoom>(SocketEventNames.joinRoom, {
      publicKey: getPublicKeyForSockets(),
      roomId: roomId,
      signature,
    });
  };

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<IJoinRoomForm>();

  return (
    <article className="h-100 d-flex">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`form text-white d-flex flex-column p-4 w-75 m-auto bgGlass`}
      >
        <div className="mb-5">
          <label className="form-label">Room code</label>
          <input
            placeholder="Fill with the game id provided by the creator of the room"
            className={`form-control`}
            {...register("roomCode", { required: true })}
          />
          <small className="form-text text-warning">
            {errors?.roomCode && `Rome code is required.`}
          </small>
        </div>
        <input
          disabled={isSubmitting}
          value="Join Room"
          className="btn w-50 m-auto btn-warning"
          type="submit"
        />
      </form>
    </article>
  );
};
