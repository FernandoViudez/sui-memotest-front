import { useEffect, useState } from "react";
import { CreateRoom } from "./components/CreateRoom/CreateRoom";
import { RoomList } from "./components/RoomList/RoomList";
import { RoomSelection } from "./components/RoomSelection";
import { LobbyView } from "./views/LobbyView";

import { RoomStatus } from "@/types/RoomStatus";
import styles from "./Lobby.module.css";

export const Lobby = () => {
  const [roomStatus, setOption] = useState<RoomStatus>("unset");
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
      <button
        onClick={() => setOption("unset")}
        className={styles.fixedBtn}
      >
        Back
      </button>

      {roomStatus === "unset" && (
        <RoomSelection onRoomSelection={setOption} />
      )}

      {/* TODO: create rooms list */}

      {roomStatus === "join-room" && (
        <RoomList onSelectRoom={onSetLobbyReady} />
      )}

      {/* TODO: create room form */}

      {roomStatus === "create-room" && (
        <CreateRoom onCreateRoom={onSetLobbyReady} />
      )}

      {lobbyReady && <LobbyView />}
    </>
  );
};
