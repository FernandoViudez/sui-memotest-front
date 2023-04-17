import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import styles from "./LobbyView.module.css";

export const LobbyView = () => {
  const { currentRoom } = useSelector(
    (state: RootState) => state.memotest
  );
  const dispatch = useDispatch<AppDispatch>();

  const startGame = () => {
    console.log("startGame");
    // dispatch();
    // changeGameState()
  };
  return (
    <article className="h-100 d-flex justify-content-center align-items-center">
      <div
        className={`d-flex flex-column justify-content-between m-auto bgGlass w-75 p-2 ${styles.mh50vh}`}
      >
        <div>
          <div className="d-flex px-3 w-100 align-items-center justify-content-between">
            <p className="h4 text-center text-light m-0">Players</p>
            {/* IN loby game code to share */}
            <div className="d-flex flex-column justify-content-center">
              <strong className="text-light text-center">
                Room Code
              </strong>
              <div className="d-flex justify-content-center align-items-center">
                <span className="text-light">
                  {currentRoom?.details.roomCode.slice(0, 10) + "..."}
                </span>
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(
                      currentRoom?.details.roomCode as string
                    )
                  }
                  className={`text-primary mx-2 ${styles.cursorPointer}`}
                >
                  copy
                </span>
              </div>
            </div>
          </div>
        </div>
        <ul className="list-group" style={{ borderRadius: 0 }}>
          {currentRoom?.players.map((p, index) => (
            <li
              key={index}
              className={`list-group-item mb-1 text-white ${styles.listGroupItem}`}
            >
              <div className="d-flex justify-content-between">
                <strong className="text-capitalize text-secondary">
                  {p.name || "Player " + (index + 1)}
                </strong>
                <small className="form-text text-muted">
                  {p.walletAddress.slice(0, 20) + "..."}
                </small>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={startGame}
          className="btn btn-primary w-50 m-auto mt-3 mb-1"
        >
          Start Game
        </button>
      </div>
    </article>
  );
};
