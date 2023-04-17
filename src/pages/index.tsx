import { GamePreviewCard } from "@/components/shared/GamePreviewCard/GamePreviewCard";

import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <article className="container ">
        <div className="m-auto mt-3 mb-5 text-white d-flex flex-column">
          <h3>Minigames</h3>
          <hr className="m-0" />
        </div>

        <GamePreviewCard navigateTo={"/memotest"} />
      </article>
    </>
  );
}
