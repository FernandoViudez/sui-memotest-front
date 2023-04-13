import { useMemotest } from "@/hooks/memotest/useMemotest";
import { ICard } from "@/interfaces/Card";
import { IPlayer } from "@/interfaces/Player";
import { useCallback } from "react";
import { MemotestCard } from "../MemotestCard";
import { Player } from "../Player";

const initMemotestTable: ICard[] = new Array(16).fill(0).map(
  (v, index) =>
    ({
      id: "null",
      image: "",
      position: index,
      revealed: false,
    } as ICard)
);

export const MemotestView = () => {
  const {
    players: [player1, player2, player3 = null, player4 = null],
    cardsRevealed,
    onRevealCard,
    currentPlayer,
    turn,
  } = useMemotest(initMemotestTable);

  const getPlayer = useCallback(
    (player: IPlayer) => {
      return {
        ...player,
        isCurrentPlayer:
          player.walletAddress === currentPlayer.walletAddress,
      };
    },
    [currentPlayer]
  );

  return (
    <div className="row p-0 m-0 h-100">
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={getPlayer(player1)} />
        {player3 && <Player player={getPlayer(player3)} />}
      </article>
      <article className="col p-0 ">
        {/* Memotest Container  & Layout */}
        <div className="bg-dark p-0 container h-100 rounded">
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
                    turn.status === "finished" ||
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
        <Player player={getPlayer(player2)} />
        {player4 && <Player player={getPlayer(player4)} />}
      </article>
    </div>
  );
};
