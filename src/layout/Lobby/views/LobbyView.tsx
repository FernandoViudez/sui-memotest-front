import { useContract, useProvider, useSocket } from "@/hooks/memotest";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import {
  IPlayerJoined,
  IPlayerLeft,
} from "@/interfaces/memotest/player.interface";
import { AppDispatch, RootState } from "@/store";
import { addPlayer, removePlayer } from "@/store/slices/memotest";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./LobbyView.module.css";

export const LobbyView = () => {
  const { currentRoom } = useSelector((state: RootState) => state.memotest);
  const {
    wallet: { walletAddress, name },
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const { getObjectById } = useProvider();
  const contract = useContract();
  const socket = useSocket(Namespace.memotest);

  const onPlayerJoined = useCallback(
    (data: IPlayerJoined) => dispatch(addPlayer(data)),
    [dispatch]
  );

  // TODO: get gameBoard status and check if finished. if finished then enable claim btn for the remaining player to withdraw his betted amount.
  const onPlayerLeft = useCallback(
    (data: IPlayerLeft) => dispatch(removePlayer(data)),
    [dispatch]
  );

  useEffect(() => {
    socket.listen(SocketEventNames.onPlayerJoined, onPlayerJoined);
    socket.listen(SocketEventNames.onPlayerLeft, onPlayerLeft);
    return () => {
      socket.off(SocketEventNames.onPlayerJoined, onPlayerJoined);
      socket.off(SocketEventNames.onPlayerLeft, onPlayerLeft);
    };
  });

  const startGame = async () => {
    if ((currentRoom as ICurrentRoom).players.length < 2) {
      return;
    }
    await contract.startGame(
      currentRoom?.details.roomCode.split(":")[1] as string
    );
    socket.emit(SocketEventNames.startGame);
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
              <strong className="text-light text-center">Room Code</strong>
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
              className={`list-group-item mb-1 text-white ${
                styles.listGroupItem
              } ${p.walletAddress == walletAddress ? "bg-light" : ""}`}
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
        {currentRoom?.details.owner != walletAddress ? (
          <div></div>
        ) : (
          <button
            disabled={(currentRoom as ICurrentRoom).players.length < 2}
            onClick={startGame}
            className="btn btn-primary w-50 m-auto mt-3 mb-1"
          >
            Start Game
          </button>
        )}
      </div>
    </article>
  );
};
