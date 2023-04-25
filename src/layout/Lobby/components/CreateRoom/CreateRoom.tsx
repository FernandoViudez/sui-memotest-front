import { RootState } from "@/store";
import { useSelector } from "react-redux";

import { useCreateRoom } from "@/hooks/memotest/useCreateRoom";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./CreateRoom.module.css";

interface ICreateRoomForm {
  isPrivate: boolean;
  bet: number;
}

export const CreateRoom = ({ onCreateRoom }: { onCreateRoom: () => void }) => {
  const { walletAddress, name } = useSelector(
    (state: RootState) => state.wallet
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ICreateRoomForm>();

  const { createRoom, minBetAmount } = useCreateRoom({
    walletAddress,
    onCreateRoom,
  });

  const onSubmit: SubmitHandler<ICreateRoomForm> = async (form) => {
    await createRoom(form.bet, form.isPrivate);
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
            {...register("bet", {
              min: minBetAmount,
              required: true,
            })}
          />
          <small className="form-text text-warning">
            {errors?.bet && `The min value is ${minBetAmount}`}
          </small>
        </div>
        <div className="mb-5 d-flex align-items-center justify-content-center">
          <label className="m-0 form-label">Create a private room</label>
          <input
            className={`form-checkbox mx-1 ${styles.inputStyles}`}
            type="checkbox"
            {...register("isPrivate", { value: false })}
          />
          <small className="form-text text-warning">
            {errors?.bet && `The min value is ${minBetAmount}`}
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
