import { useState } from "react";
import { CreateRoom } from "./components/CreateRoom/CreateRoom";
import { RoomList } from "./components/RoomList/RoomList";
import { RoomSelection } from "./components/RoomSelection";
import { LobbyView } from "./views/LobbyView";

import styles from "./Lobby.module.css";

export const Lobby = () => {
  const [room, setRoom] = useState<
    "create-room" | "join-room" | "unset"
  >("unset");

  const [lobbyReady, setLobbyReady] = useState<boolean>(false);

  return (
    <>
      <button
        onClick={() => setRoom("unset")}
        className={styles.fixedBtn}
      >
        Back
      </button>

      {room === "unset" && (
        <RoomSelection onRoomSelection={setRoom} />
      )}

      {/* TODO: create rooms list */}

      {room === "join-room" && (
        <RoomList onSelectRoom={setLobbyReady} />
      )}

      {/* TODO: create room form */}

      {room === "create-room" && (
        <CreateRoom onCreateRoom={setLobbyReady} />
      )}

      {lobbyReady && <LobbyView />}
    </>
  );
};
