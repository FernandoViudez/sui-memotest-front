import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";

import { createGameRoom } from "@/store/slices/memotest";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "./CreateRoom.module.css";

interface ICreateRoomForm {
  name: string;
  isPrivate?: boolean;
  password?: string;
}

export const CreateRoom = ({ onCreateRoom }: { onCreateRoom: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { walletAddress, name } = useSelector(
    (state: RootState) => state.wallet
  );

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ICreateRoomForm>();

  const onSubmit: SubmitHandler<ICreateRoomForm> = ({ name, password }) => {
    dispatch(
      createGameRoom(
        {
          isPrivate: !!password?.length,
          name,
          type: "memotest",
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
  };

  return (
    <article className="h-100 d-flex">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`form text-white d-flex flex-column p-4 w-75 m-auto bgGlass`}
      >
        <div className="mb-5">
          <label className="form-label">Room Name</label>
          <input
            placeholder="Room name"
            className={`form-control ${styles.inputStyles}`}
            type="text"
            {...register("name", { required: true, minLength: 3 })}
          />
          <small className="form-text text-warning">
            {errors?.name && "The required min length is 3 characters"}
          </small>
        </div>
        <div className="mb-5">
          <label className="form-label">Room Password</label>
          <input
            placeholder="Room password"
            className={`form-control ${styles.inputStyles}`}
            type="text"
            {...register("password", { minLength: 3 })}
          />
          <small className="form-text text-warning">
            {errors?.password && "The required min length is 3 characters"}
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
