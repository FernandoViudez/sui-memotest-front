// NOTE useEffect https://www.youtube.com/shorts/cTNc2KlsjmY
import { ICard } from "@/interfaces/Card";
import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { RootState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MemotestCard } from "../MemotestCard";
import { Player } from "../Player";

export const MemotestView = () => {
  const memo = new Array(16).fill(0).map(
    (v, index) =>
      ({
        id: "null",
        image: null,
        position: index,
        revealed: false,
      } as ICard)
  );
  const memotestState = useSelector(
    (state: RootState) => state.memotest
  );
  const currentRoom = memotestState.currentRoom as IGameRoom;
  const [player1, player2, player3 = null, player4 = null] =
    currentRoom?.players;
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(
    currentRoom.players[0]
  );
  const [cardsRevealed, setCardsRevealed] = useState<ICard[]>(memo);
  const [turn, setTurn] = useState({
    status: "started",
    flippedCardsAmount: 0,
    flippedCards: new Array(),
  });

  const onRevealCard = useCallback((position: number) => {
    // TODO: Get card img & id

    setCardsRevealed((state) => {
      return state.map((c) =>
        c.position === position
          ? {
              id: null,
              image: null,
              position,
              revealed: true,
            }
          : c
      );
    });

    setTurn(({ flippedCardsAmount, flippedCards }) => {
      return {
        flippedCardsAmount: flippedCardsAmount + 1,
        flippedCards: [
          ...flippedCards,
          {
            id: null,
            image: null,
            position,
            revealed: true,
          },
        ],
        status: "in-process",
      };
    });
  }, []);

  useEffect(() => {
    if (turn.flippedCardsAmount < 2) {
      return;
    }

    const [card1, card2] = turn.flippedCards;

    if (card1.id === card2.id) {
      setCardsRevealed((state) => {
        const newState = [...state];
        state[card1.position] = {
          ...card1,
          revealedByPlayer: currentPlayer.walletAddress,
        };
        state[card2.position] = {
          ...card2,
          revealedByPlayer: currentPlayer.walletAddress,
        };
        return newState;
      });
    }

    // init game again
    setTurn({
      flippedCardsAmount: 0,
      flippedCards: new Array(),
      status: "finished",
    });
  }, [currentPlayer.walletAddress, turn]);

  //NOTE - Sockets Connection

  // End sockets connection

  return (
    <div className="row p-0 m-0 h-100">
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={player1} />
        {player3 && <Player player={player3} />}
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
                  cannotBeFlipped={turn.status === "finished"}
                  revealedInTurn={
                    c.revealed || !!c?.revealedByPlayer?.length
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </article>
      <article className="col-2 d-flex flex-column justify-content-between align-items-center">
        <Player player={player2} />
        {player4 && <Player player={player4} />}
      </article>
    </div>
  );
};
