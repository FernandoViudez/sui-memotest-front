import { Dispatch, SetStateAction } from "react";

export const RoomSelection = ({
  onRoomSelection,
}: {
  onRoomSelection: Dispatch<
    SetStateAction<"create-room" | "join-room" | "unset">
  >;
}) => {
  return (
    <article className="h-100 d-flex">
      <div className="w-50 d-flex m-auto p-3 justify-content-evenly align-items-center">
        <button
          onClick={() => onRoomSelection("create-room")}
          className="btn btn-primary"
        >
          Create Room
        </button>
        <button
          onClick={() => onRoomSelection("join-room")}
          className="btn btn-info"
        >
          Join Room
        </button>
      </div>
    </article>
  );
};
