import Head from "next/head";

import { MemotestCard, Player } from "@/components/pages/Memotest";

import { Lobby } from "@/layout/Lobby";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import styles from "./Memotest.module.css";

export default function Memotest() {
  const { game } = useSelector((state: RootState) => state.memotest);

  return (
    <>
      <Head>
        <title>Memotest</title>
      </Head>
      <div className={`container p-3 ${styles.mainContainer}`}>
        {game.ready ? <_MemotestPage /> : <Lobby />}
      </div>
    </>
  );
}

function _MemotestPage() {
  const memotest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  return (
    <div className="row p-0 m-0 h-100">
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={{ name: "John " }} />
        <Player player={{ name: "John " }} />
      </article>
      <article className="col p-0 ">
        {/* Memotest Container */}
        <div className="bg-dark p-0 container h-100 rounded">
          <_MemotestLayout memotest={memotest} />
        </div>
      </article>
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={{ name: "John " }} />
        <Player player={{ name: "John " }} />
      </article>
    </div>
  );
}

function _MemotestLayout({ memotest }: { memotest: number[] }) {
  return (
    <div className="row m-auto p-0 h-100">
      {memotest.map((memoItem) => (
        <div
          className="col-lg-3 d-flex p-1 justify-content-center align-items-center"
          key={Date.now() * Math.random()}
        >
          <MemotestCard imgBack="" />
        </div>
      ))}
    </div>
  );
}
