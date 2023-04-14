import { MemotestView } from "@/components/pages/Memotest/views/MemotestView";
import { GameStatus } from "@/enums";
import { useProtectRoutes } from "@/hooks/useProtectRoutes/useProtectRoutes";
import { Lobby } from "@/layout/Lobby";
import { AppDispatch, RootState } from "@/store";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Memotest.module.css";

export default function Memotest() {
  const { currentRoom } = useSelector(
    (state: RootState) => state.memotest
  );
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useProtectRoutes("/memotest", () => {
    // TODO Remove
    console.log("not authenticated");
  });

  return (
    isAuthenticated() && (
      <>
        <Head>
          <title>Memotest</title>
        </Head>
        <div className={`container p-3 ${styles.mainContainer}`}>
          {currentRoom?.details.roomStatus === GameStatus.Playing ? (
            <MemotestView />
          ) : (
            <Lobby />
          )}
        </div>
      </>
    )
  );
}
