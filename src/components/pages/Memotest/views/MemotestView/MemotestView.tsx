import { useMemotest } from "@/hooks/memotest/useMemotest";
import { MemotestCard } from "../../MemotestCard";
import { Player } from "../../Player";

export const MemotestView = () => {
  const {
    players: [player1, player2, player3 = null, player4 = null],
    cardsRevealed,
    room,
    thisPlayer,
    onRevealCard,
    turn,
  } = useMemotest();

  const handleClaimProcess = () => {
    console.log("CLaim process");
  };

  return (
    <>
      <div className="row p-0 m-0 h-100">
        <article className="col-2 d-flex flex-column justify-content-between align-items-center">
          {player1 && <Player player={player1} />}
          {player3 && <Player player={player3} />}
        </article>
        <article className="col p-0 ">
          {/* Memotest Container  & Layout */}
          <div className={`bg-dark p-0 container h-100 rounded`}>
            <div className="row m-auto p-0 h-100">
              {cardsRevealed.map((c, i) => (
                <div
                  className="col-lg-3 d-flex p-1 justify-content-center align-items-center"
                  key={i}
                >
                  <MemotestCard
                    onRevealCard={onRevealCard}
                    position={i}
                    cannotBeFlipped={
                      !thisPlayer?.isCurrentPlayer ||
                      turn.status === "finished" ||
                      // c.clicked ||
                      !!c?.revealedByPlayer?.length
                    }
                    isFlipped={c.revealed}
                    isDiscovered={!!c?.revealedByPlayer?.length}
                  />
                </div>
              ))}
            </div>
          </div>
        </article>
        <article className="col-2 d-flex flex-column justify-content-between align-items-center">
          {player2 && <Player player={player2} />}
          {player4 && <Player player={player4} />}
        </article>
      </div>
    </>
  );
};
