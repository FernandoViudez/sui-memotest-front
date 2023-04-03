import Head from "next/head";

import { MemotestCard } from "@/components/pages/Memotest/MemotestCard";
import styles from "./Memotest.module.css";

export default function Memotest() {
  const memotest = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  return (
    <>
      <Head>
        <title>Memotest</title>
      </Head>

      <div className={`container p-3 ${styles.mainContainer}`}>
        <div className="row p-0 m-0 h-100">
          <article className="col-2 d-flex flex-column justify-content-between align-items-center">
            <div className="h-25 w-100 bg-primary"></div>
            <div className="h-25 w-100 bg-primary"></div>
          </article>
          <article className="col p-0 ">
            {/* Memotest Container */}
            <div className="bg-dark p-0 container h-100 rounded">
              <_memotestLayout memotest={memotest} />
            </div>
          </article>
          <article className="col-2 d-flex flex-column justify-content-between align-items-center">
            <div className="h-25 w-100 bg-primary"></div>
            <div className="h-25 w-100 bg-primary"></div>
          </article>
        </div>
      </div>
    </>
  );
}

function _memotestLayout({ memotest }: { memotest: number[] }) {
  return (
    <div className="row m-auto p-0 h-100 ">
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
