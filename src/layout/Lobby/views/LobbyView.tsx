import { GameStatus } from "@/enums";
import { useContract, useSocket } from "@/hooks/memotest";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import {
  IPlayerJoined,
  IPlayerLeft,
} from "@/interfaces/memotest/player.interface";
import { AppDispatch, RootState } from "@/store";
import {
  addPlayer,
  changeGameState,
  removePlayer,
} from "@/store/slices/memotest";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./LobbyView.module.css";

export const LobbyView = () => {
  const {
    memotest: { currentRoom },
    wallet,
  } = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const contract = useContract();
  const socket = useSocket(Namespace.memotest);

  const showStartGameBtn = useMemo(
    () => currentRoom?.details.owner !== wallet.walletAddress,
    [currentRoom, wallet]
  );

  const enableStartGameBtn = useMemo(
    () => (currentRoom as ICurrentRoom).players.length < 2,
    [currentRoom]
  );

  const handleGameStatus = useCallback(() => {
    console.log("Game Started");
    dispatch(changeGameState({ status: GameStatus.Playing }));
  }, [dispatch]);

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

  useEffect(() => {
    socket.listen(SocketEventNames.onGameStarted, handleGameStatus);
    return () => {
      socket.off(SocketEventNames.onGameStarted, handleGameStatus);
    };
  }, [handleGameStatus, socket]);

  const startGame = async () => {
    if (enableStartGameBtn) return;
    await contract.startGame(
      currentRoom?.details.gameboardObjectId as string
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
              <strong className="text-light text-center">
                Room Code
              </strong>
              <div className="d-flex justify-content-center align-items-center">
                <span className="text-light">
                  {currentRoom?.details.id + "..."}
                </span>
                <span
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${currentRoom?.details.id}:${currentRoom?.details.gameboardObjectId}`
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
              className={`list-group-item mb-1 text-white ${styles.listGroupItem} `}
            >
              <div className="d-flex justify-content-between">
                <strong className={`text-capitalize text-secondary`}>
                  {p.walletAddress.slice(0, 20) + "..."}
                </strong>
                {currentRoom?.details.owner ===
                  wallet.walletAddress &&
                wallet.walletAddress === p.walletAddress ? (
                  <small className={"form-text text-info"}>
                    Admin (me)
                  </small>
                ) : currentRoom?.details.owner === p.walletAddress ? (
                  <small className={"form-text text-info"}>
                    Admin
                  </small>
                ) : wallet.walletAddress === p.walletAddress ? (
                  <small className={"form-text text-success"}>
                    Me
                  </small>
                ) : (
                  <small className={"form-text"}>Player</small>
                )}
              </div>
            </li>
          ))}
        </ul>
        {showStartGameBtn ? (
          <></>
        ) : (
          <button
            disabled={
              (currentRoom as ICurrentRoom).players.length < 2
            }
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
