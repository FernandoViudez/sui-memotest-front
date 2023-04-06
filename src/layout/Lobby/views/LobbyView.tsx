import { IPlayer } from "@/interfaces/Player";
import { AppDispatch, RootState } from "@/store";
import { changeGameState } from "@/store/slices/memotest";
import { useDispatch, useSelector } from "react-redux";

export const LobbyView = () => {
  const {
    memotest: { currentRoom },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const players = currentRoom?.players as IPlayer[];

  return (
    <article className="h-100 d-flex justify-content-center align-items-center">
      <ul className="list-group d-flex flex-column m-auto bg-secondary w-75 p-2">
        <div>
          <p className="h4  text-center text-light m-0">Players</p>
          <hr className="text-light mx-auto mt-0 mb-4 w-50" />
        </div>
        {players.map((p, index) => (
          <li
            key={index}
            className="list-group-item mb-1 list-group-item-secondary text-white rounded"
          >
            <div className="d-flex flex-column">
              <strong className="text-capitalize text-secondary">
                {p.name || "Player " + (index + 1)}
              </strong>
              <small className="form-text text-muted">
                {p.walletAddress.slice(0, 20) + "..."}
              </small>
            </div>
          </li>
        ))}
        <button
          onClick={() => dispatch(changeGameState())}
          className="btn btn-primary w-50 m-auto mt-3 mb-1"
        >
          Start Game
        </button>
      </ul>
    </article>
  );
};
