import { useEffect, useState } from "react";
import { CreateRoom } from "./components/CreateRoom/CreateRoom";
import { JoinRoom } from "./components/JoinRoom/JoinRoom";
import { RoomSelection } from "./components/RoomSelection";
import { LobbyView } from "./views/LobbyView";

import { RoomStatus } from "@/types/RoomStatus";
import styles from "./Lobby.module.css";
import { RoomList } from "./components/RoomList/RoomList";

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

  const onJoinPrivateRoom = (roomStatus: RoomStatus) => {
    setOption(roomStatus);
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

      {RoomStatus === "room-list" && (
        <RoomList
          onJoinRoom={onSetLobbyReady}
          onJoinPrivateRoom={onJoinPrivateRoom}
        />
      )}

      {RoomStatus === "join-room" && (
        <JoinRoom onJoinRoom={onSetLobbyReady} />
      )}

      {RoomStatus === "create-room" && (
        <CreateRoom onCreateRoom={onSetLobbyReady} />
      )}

      {lobbyReady && <LobbyView />}
    </>
  );
};
