import { RootState } from "@/store";
import { RoomStatus } from "@/types/RoomStatus";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

interface IJoinRoomForm {
  roomCode: string;
  bet: number;
}
export const RoomList = ({
  onJoinRoom,
  onJoinPrivateRoom,
}: {
  onJoinPrivateRoom: (roomStatus: RoomStatus) => void;
  onJoinRoom: () => void;
}) => {
  const {
    memotest: { publicRooms },
    wallet: { walletAddress, name },
  } = useSelector((state: RootState) => state);

  const onSubmit: SubmitHandler<IJoinRoomForm> = async (form) => {
    console.log("onSubmit");
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
