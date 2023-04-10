import { AppDispatch, RootState } from "@/store";
import { enterGameRoom } from "@/store/slices/memotest";
import { useDispatch, useSelector } from "react-redux";
export const RoomList = ({
  onSelectRoom,
}: {
  onSelectRoom: () => void;
}) => {
  const {
    memotest: { rooms },
    wallet: { walletAddress, name },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();

  const enterRoom = (id: string) => {
    dispatch(enterGameRoom(id, { walletAddress, name }));
    onSelectRoom();
  };

  return (
    <article className="h-100 w-100 p-3 d-flex flex-column">
      <div>
        <p className="text-white h5">Rooms</p>
        <hr className="text-light mt-0" />
      </div>
      <ul className="list-group  w-100">
        {rooms.map((r) => (
          <li
            key={r.id}
            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          >
            <span className="text-capitalize text-secondary">
              {r.name}
            </span>
            <a
              onClick={() => enterRoom(r.id)}
              href="#"
              className="text-capitalize text-success"
            >
              join
            </a>
          </li>
        ))}
      </ul>
    </article>
  );
};
