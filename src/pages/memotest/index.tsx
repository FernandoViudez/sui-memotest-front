import { MemotestView } from "@/components/pages/Memotest/views/MemotestView";
import { useProtectRoutes } from "@/hooks/useProtectRoutes/useProtectRoutes";
import { Lobby } from "@/layout/Lobby";
import { AppDispatch, RootState } from "@/store";
import { changeGameState } from "@/store/slices/memotest";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Memotest.module.css";

export default function Memotest() {
  const { game } = useSelector((state: RootState) => state.memotest);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useProtectRoutes("/memotest", () => {
    dispatch(changeGameState());
  });

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
