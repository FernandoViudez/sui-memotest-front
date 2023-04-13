import { MemotestView } from "@/components/pages/Memotest/views/MemotestView";
import { useProtectRoutes } from "@/hooks/useProtectRoutes/useProtectRoutes";
import { Lobby } from "@/layout/Lobby";
import { AppDispatch, RootState } from "@/store";
import { changeGameState } from "@/store/slices/memotest";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Memotest.module.css";
import { useEffect } from "react";
import { useSocket } from "../../hooks/memotest";
import { SocketError } from "../../interfaces/socket-error.interface";
import { SocketEventNames } from "../../types/memotest/socket-event-names.enum";

export default function Memotest() {
  const { game } = useSelector((state: RootState) => state.memotest);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useProtectRoutes("/memotest", () => {
    dispatch(changeGameState());
  });

  const socket = useSocket();

  useEffect(() => {
    socket.listen(SocketEventNames.onError, handleError);
  }, []);

  function handleError(error: SocketError) {
    alert(JSON.stringify(error));
  }

  return (
    isAuthenticated() && (
      <>
        <Head>
          <title>Memotest</title>
        </Head>
        <div className={`container p-3 ${styles.mainContainer}`}>
          {game.ready ? <MemotestView /> : <Lobby />}
        </div>
      </>
    )
  );
}
