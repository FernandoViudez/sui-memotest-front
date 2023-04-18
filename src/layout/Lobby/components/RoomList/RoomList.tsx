import { useRoomList } from "@/hooks/memotest/useRoomList";
import { RoomStatus } from "@/types/RoomStatus";

export const RoomList = ({
  onSelectRoom,
  onJoinPrivateRoom,
}: {
  onJoinPrivateRoom: (roomStatus: RoomStatus) => void;
  onSelectRoom: () => void;
}) => {
  const { joinRoom, publicRooms } = useRoomList({ onSelectRoom });

  const enterRoom = async (roomId: string, gameboardId: string) => {
    await joinRoom(`${roomId}:${gameboardId}`);
  };

  return (
    <article className="h-100 w-100 p-3 d-flex flex-column">
      <div>
        <div className="d-flex justify-content-between align-items-end">
          <p className="text-white h5">Rooms</p>
          <button
            onClick={() => onJoinPrivateRoom("join-room")}
            className="btn p-1 mb-2 btn-success"
          >
            Join private room
          </button>
        </div>
        <hr className="text-light mt-0" />
      </div>
      <ul className="list-group  w-100">
        {publicRooms?.length ? (
          publicRooms.map((r) => (
            <li
              key={r.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <span className="text-capitalize text-secondary">
                {r.id}
              </span>
              <a
                onClick={() => enterRoom(r.id, r.gameboardObjectId)}
                href="#"
                className="text-capitalize text-success"
              >
                join
              </a>
            </li>
          ))
        ) : (
          <div className="m-auto d-flex justify-content-center">
            <div
              className="spinner-border text-success"
              role="status"
            ></div>
          </div>
        )}
      </ul>
    </article>
  );
};
