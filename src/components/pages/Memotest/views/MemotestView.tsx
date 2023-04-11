import { MemotestCard } from "../MemotestCard";
import { Player } from "../Player";

export const MemotestView = () => {
  const memotest = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
  return (
    <div className="row p-0 m-0 h-100">
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={{ name: "John " }} />
        <Player player={{ name: "John " }} />
      </article>
      <article className="col p-0 ">
        {/* Memotest Container  & Layout */}
        <div className="bg-dark p-0 container h-100 rounded">
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
        </div>
      </article>
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={{ name: "John " }} />
        <Player player={{ name: "John " }} />
      </article>
    </div>
  );
};
