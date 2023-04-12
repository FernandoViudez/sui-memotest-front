import { AppDispatch, RootState } from "@/store";
import { enterGameRoom } from "@/store/slices/memotest";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  useContract,
  useProvider,
  useSocket,
} from "../../../../hooks/memotest";
import { environment } from "../../../../environment/enviornment";
import { IGameConfig } from "../../../../interfaces/memotest/game-config.interface";
import { SocketEventNames } from "../../../../types/memotest/socket-event-names.enum";
import { IPlayerJoined } from "../../../../interfaces/memotest/player.interface";
import { IJoinRoom } from "../../../../interfaces/memotest/room.interface";

interface IJoinRoomForm {
  roomCode: string;
  bet: number;
}
// TODO: Change "RoomList" to "JoinRoom"
export const RoomList = ({ onJoinRoom }: { onJoinRoom: () => void }) => {
  const {
    memotest: { rooms },
    wallet: { walletAddress, name },
  } = useSelector((state: RootState) => state);
  const [minimumBetAmount, setMinimumBetAmount] = useState(0);
  const [roomCode, setRoomCode] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { getObjectById, getPublicKeyForSockets, getSignatureForSockets } =
    useProvider();
  const socket = useSocket();
  const contractService = useContract();

  useEffect(() => {
    getObjectById<IGameConfig>(environment.memotest.config).then((config) => {
      setMinimumBetAmount(config.minimum_bet_amount);
    });
    socket.listen(SocketEventNames.onPlayerJoined, onPlayerJoined);
    socket.listen(SocketEventNames.onError, console.log);
  });

  function onPlayerJoined(data: IPlayerJoined) {
    console.log("Player joined ~> ", data.id);
    // TODO: Fix data flow before changing screen
    // dispatch(enterGameRoom(roomCode, { walletAddress, name }));
    // onJoinRoom();
  }

  const onSubmit: SubmitHandler<IJoinRoomForm> = async (form) => {
    setRoomCode(form.roomCode);
    const [roomId, gameId] = form.roomCode.split(":");
    const signature = await getSignatureForSockets(socket.clientId);
    await contractService.joinRoom(gameId, form.bet as number);
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
        <div className="mb-5">
          <label className="form-label">Amount to bet</label>
          <input
            placeholder="Amount to bet in SUI token"
            className={`form-control`}
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
