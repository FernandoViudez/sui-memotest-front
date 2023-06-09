import { SubmitHandler, useForm } from "react-hook-form";
import { useJoinRoom } from "../../../../hooks/memotest/useJoinRoom";

interface IJoinRoomForm {
  roomCode: string;
  bet: number;
}

export const JoinRoom = ({
  onJoinRoom,
}: {
  onJoinRoom: () => void;
}) => {
  const { joinRoom } = useJoinRoom({ onJoinRoom });

  const onSubmit: SubmitHandler<IJoinRoomForm> = async (form) => {
    await joinRoom(form.roomCode);
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
