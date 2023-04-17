import { useEffect, useState } from "react";
import { CreateRoom } from "./components/CreateRoom/CreateRoom";
import { JoinRoom } from "./components/JoinRoom/JoinRoom";
import { RoomSelection } from "./components/RoomSelection";
import { LobbyView } from "./views/LobbyView";

import { RoomStatus } from "@/types/RoomStatus";
import styles from "./Lobby.module.css";

export const Lobby = () => {
  const [RoomStatus, setOption] = useState<RoomStatus>("unset");
  const [lobbyReady, setLobbyReady] = useState<boolean>(false);

  useEffect(() => {
    if (lobbyReady) {
      setOption(() => "process-finished");
    }
  }, [lobbyReady]);

  const onSetLobbyReady = () => {
    setLobbyReady((state) => !state);
  };

  return (
    <>
      {RoomStatus !== "unset" && (
        <button
          onClick={() => {
            setLobbyReady(false);
            setOption("unset");
          }}
          className={`btn btn-primary ${styles.fixedBtn}`}
        >
          Back
        </button>
      )}

      {RoomStatus === "unset" && (
        <RoomSelection onRoomSelection={setOption} />
      )}

      {/* TODO: create rooms list */}

      {RoomStatus === "join-room" && (
        <JoinRoom onJoinRoom={onSetLobbyReady} />
      )}

      {/* TODO: create room form */}

      {RoomStatus === "create-room" && (
        <CreateRoom onCreateRoom={onSetLobbyReady} />
      )}

      {lobbyReady && <LobbyView />}
    </>
  );
};
