import {
  GameFinishedView,
  MemotestView,
} from "@/components/pages/Memotest/views";
import { GameStatus } from "@/enums";
import { useSocket } from "@/hooks/memotest";
import { useProtectRoutes } from "@/hooks/useProtectRoutes/useProtectRoutes";
import { SocketError } from "@/interfaces/socket-error.interface";
import { Lobby } from "@/layout/Lobby";
import { RootState } from "@/store";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import Head from "next/head";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Memotest.module.css";

export default function Memotest() {
  const { currentRoom } = useSelector(
    (state: RootState) => state.memotest
  );

  const { isAuthenticated } = useProtectRoutes("/memotest", () => {
    console.log("not authenticated");
  });

  const socket = useSocket(Namespace.memotest);

  const handleError = useCallback((error: SocketError) => {
    console.log(error);
    // alert(JSON.stringify(error)); // TODO Restore
  }, []);

  useEffect(() => {
    socket.listen(SocketEventNames.onError, handleError);
    return () => {
      socket.off(SocketEventNames.onError, handleError);
    };
  }, [handleError, socket]);

  if (!isAuthenticated()) return;

  if (currentRoom?.details.gameStatus === GameStatus.Playing) {
    return (
      <>
        <Head>
          <title>Memotest</title>
        </Head>
        <div className={`container p-3 ${styles.mainContainer}`}>
          <MemotestView />
        </div>
      </>
    );
  } else if (
    currentRoom?.details.gameStatus === GameStatus.Finished
  ) {
    return (
      <>
        <Head>
          <title>Game Finished</title>
        </Head>
        <div className={`container p-3 ${styles.mainContainer}`}>
          <GameFinishedView />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>Lobby</title>
        </Head>
        <div className={`container p-3 ${styles.mainContainer}`}>
          <Lobby />
        </div>
      </>
    );
  }
}
