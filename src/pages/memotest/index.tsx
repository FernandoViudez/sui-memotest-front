import { MemotestView } from "@/components/pages/Memotest/views/MemotestView";
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
  // const [canRenderMemotest, setCanRenderMemotest] = useState(false);
  // const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useProtectRoutes("/memotest", () => {
    // TODO Remove
    console.log("not authenticated");
  });
  const socket = useSocket(Namespace.memotest);

  const handleError = useCallback((error: SocketError) => {
    alert(JSON.stringify(error));
  }, []);

  useEffect(() => {
    socket.listen(SocketEventNames.onError, handleError);
    return () => {
      socket.off(SocketEventNames.onError, handleError);
    };
  }, [handleError, socket]);

  // const handleGameStatus = useCallback(() => {
  //   console.log("Game Started");
  //   dispatch(changeGameState({ status: GameStatus.Playing }));
  // }, [dispatch]);

  // useEffect(() => {
  //   socket.listen(SocketEventNames.onGameStarted, handleGameStatus);
  //   return () => {
  //     socket.off(SocketEventNames.onGameStarted, handleGameStatus);
  //   };
  // }, [handleGameStatus, socket]);

  // useEffect(() => {
  //   setCanRenderMemotest(
  //     !!(
  //       currentRoom &&
  //       currentRoom.details.gameStatus === GameStatus.Playing
  //     )
  //   );
  // }, [currentRoom]);

  return (
    isAuthenticated() && (
      <>
        <Head>
          <title>Memotest</title>
        </Head>
        <div className={`container p-3 ${styles.mainContainer}`}>
          {currentRoom?.details.gameStatus === GameStatus.Playing ? (
            <MemotestView />
          ) : (
            <Lobby />
          )}
        </div>
      </>
    )
  );
}
