import { ICard } from "@/interfaces/Card";
import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { ITurn } from "@/interfaces/Turn";
import { RootState } from "@/store";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

export const useMemotestInitValues = () => {
  const initMemotestTable = () => <ICard[]>new Array(16).fill(0).map(
      (v, index) =>
        ({
          id: "null",
          image: null,
          position: index,
          revealed: false,
        } as ICard)
    );

  const [cardsRevealed, setCardsRevealed] = useState<ICard[]>(
    initMemotestTable()
  );

  const [turn, setTurn] = useState<ITurn>({
    status: "started",
    flippedCardsAmount: 0,
    flippedCards: new Array(),
  });

  const memotestState = useSelector(
    (state: RootState) => state.memotest
  );

  const currentRoom = memotestState.currentRoom as IGameRoom;

  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(
    currentRoom.players[0]
  );

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

  return { onRevealCard };
};

export const useMemotestGameLogic = ({
  setCardsRevealed,
  currentRoom,
  setTurn,
  turn,
}: {
  setCardsRevealed: Dispatch<SetStateAction<ICard[]>>;
  setTurn: Dispatch<SetStateAction<ITurn>>;
  currentRoom: IGameRoom;
  turn: ITurn;
}) => {
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(
    currentRoom.players[0]
  );

  const [player1, player2, player3 = null, player4 = null] =
    currentRoom.players;

  const goToNextTurn = useCallback(
    () =>
      setTurn({
        flippedCardsAmount: 0,
        flippedCards: new Array(),
        status: "finished",
      }),
    [setTurn]
  );

  const comproveSwippedCards = useCallback(() => {
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
  }, [currentPlayer.walletAddress, setCardsRevealed, turn]);

  useEffect(() => {
    if (turn.flippedCardsAmount < 2) return;

    comproveSwippedCards();

    goToNextTurn();
  }, [
    currentPlayer.walletAddress,
    comproveSwippedCards,
    goToNextTurn,
    turn,
  ]);
};
