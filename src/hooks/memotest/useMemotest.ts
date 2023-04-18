import { ICard } from "@/interfaces/Card";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { ITurn } from "@/interfaces/Turn";
import { RootState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useProvider } from "./useProvider";

const initMemotestTable: ICard[] = new Array(16)
  .fill(0)
  .map((v, index) => ({
    id: "0",
    image: "",
    revealed: false,
    perPosition: 0 + "",
    position: 0,
    revealedByPlayer: "",
  }));

export const useMemotest = () => {
  const { getObjectById } = useProvider();

  const [cardsRevealed, setCardsRevealed] =
    useState<ICard[]>(initMemotestTable);

  const [turn, setTurn] = useState<ITurn>({
    status: "started",
    flippedCardsAmount: 0,
    flippedCards: new Array(),
  });

  const { memotest: memotestState, wallet } = useSelector(
    (state: RootState) => state
  );

  const room = memotestState.currentRoom as ICurrentRoom;

  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>();
  const [thisPlayer, setThisPlayer] = useState<IPlayer>();

  const onRevealCard = useCallback((position: number) => {
    const cardData: ICard = {
      id: "",
      image: "",
      position,
      revealed: true,
      perPosition: "",
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
          currentPlayer?.walletAddress;
        newState[card2.position].revealedByPlayer =
          currentPlayer?.walletAddress;
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
  }, [currentPlayer, turn]);

  // Init currentPlayer
  useEffect(() => {
    setCurrentPlayer(
      memotestState.currentRoom?.players.find(
        (p) => p.playerTableID === 1
      )
    );
    setThisPlayer(
      memotestState.currentRoom?.players.find(
        (p) => p.walletAddress === wallet.walletAddress
      )
    );
  }, [memotestState.currentRoom?.players, wallet.walletAddress]);

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
      const players = room.players as IPlayer[];
      const playerIdx = players.indexOf(player as IPlayer);
      if (playerIdx < players.length - 1)
        return players[playerIdx + 1];
      else if (playerIdx === players.length - 1) return players[0];
      else return player;
    });
  }, [turn.status, room]);

  return {
    turn,
    onRevealCard,
    whoPlays: memotestState.currentRoom?.whoPlays,
    cardsRevealed,
    thisPlayer,
    currentPlayer,
    players: room.players as IPlayer[],
  };
};
