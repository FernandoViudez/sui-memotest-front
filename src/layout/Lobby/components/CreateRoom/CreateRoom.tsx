import { AppDispatch, RootState } from "@/store";
import { createGameRoom } from "@/store/slices/memotest";
import { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

export const CreateRoom = ({
  onCreateRoom,
}: {
  onCreateRoom: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { walletAddress, name } = useSelector(
    (state: RootState) => state.wallet
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    dispatch(
      createGameRoom(
        {
          isPrivate: true,
          name: `Room: ${Date.now() * Math.random()}`,
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
        onSubmit={onSubmit}
        className="form  text-white d-flex flex-column w-75 m-auto"
      >
        <div className="mb-3">
          <div className="form-label">Room Name</div>
          <input className="form-control" type="text" />
        </div>
        <div className="mb-5">
          <div className="form-label">Room Password</div>
          <input className="form-control" type="text" />
        </div>
        <button className="btn w-50 m-auto btn-primary" type="submit">
          Create Room
        </button>
      </form>
    </article>
  );
};
