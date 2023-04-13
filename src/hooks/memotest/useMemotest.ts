import { ICard } from "@/interfaces/Card";
import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { ITurn } from "@/interfaces/Turn";
import { RootState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const _fakeIds = [
  1018844906736, 540746393400, 416561540968, 747315715134,
  1015200748329, 346520388994, 1180316005379, 82295636262,
];

export const useMemotest = (memotestTable: ICard[]) => {
  const [cardsRevealed, setCardsRevealed] =
    useState<ICard[]>(memotestTable);

  const [turn, setTurn] = useState<ITurn>({
    status: "started",
    flippedCardsAmount: 0,
    flippedCards: new Array(),
  });

  const memotestState = useSelector(
    (state: RootState) => state.memotest
  );

  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(
    (memotestState.currentRoom as IGameRoom).players[0]
  );

  const onRevealCard = useCallback((position: number) => {
    // TODO: Get card img & id and remove fakeIds arr

    const cardData = {
      id: `${
        position < _fakeIds.length
          ? _fakeIds[position]
          : _fakeIds[position - _fakeIds.length]
      }`,
      image: null,
      position,
      revealed: true,
    };

    setCardsRevealed((state) => {
      return state.map((c) =>
        c.position === position ? cardData : c
      );
    });

    setTurn(({ flippedCardsAmount, flippedCards }) => {
      return {
        flippedCardsAmount: flippedCardsAmount + 1,
        flippedCards: [...flippedCards, cardData],
        status: "in-process",
      };
    });
  }, []);

  const goToNextTurn = useCallback(
    () =>
      setTurn({
        flippedCardsAmount: 0,
        flippedCards: new Array(),
        status: "finished",
      }),
    [setTurn]
  );

  const comproveFlippedCards = useCallback(() => {
    const [card1, card2] = turn.flippedCards;

    if (card1.id === card2.id) {
      setCardsRevealed((state) => {
        const newState = [...state];
        newState[card1.position].revealedByPlayer =
          currentPlayer.walletAddress;
        newState[card2.position].revealedByPlayer =
          currentPlayer.walletAddress;
        return newState;
      });
    } else {
      setTimeout(() => {
        setCardsRevealed((state) => {
          const newState = [...state];
          newState[card1.position].revealed = false;
          newState[card2.position].revealed = false;
          return newState;
        });
      }, 1800);
    }
  }, [setCardsRevealed, currentPlayer, turn]);

  // Game logic
  useEffect(() => {
    if (turn.flippedCardsAmount < 2) return;

    comproveFlippedCards();

    goToNextTurn();
  }, [comproveFlippedCards, goToNextTurn, turn]);

  // Change player turn
  useEffect(() => {
    if (turn.status !== "finished") return;

    setCurrentPlayer((player) => {
      const players = (memotestState.currentRoom as IGameRoom)
        .players;
      const playerIdx = players.indexOf(player);
      if (playerIdx < players.length - 1)
        return players[playerIdx + 1];
      else if (playerIdx === players.length - 1) return players[0];
      else return player;
    });
  }, [turn.status, memotestState.currentRoom]);

  return {
    turn,
    onRevealCard,
    cardsRevealed,
    currentPlayer,
    players: (memotestState.currentRoom as IGameRoom).players,
  };
};
