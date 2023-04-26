import { ICard } from "@/interfaces/Card";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { ITurn, ITurnOnChain } from "@/interfaces/Turn";
import { IGameBoard } from "@/interfaces/memotest/game-board.interface";
import * as ISocket from "@/interfaces/memotest/game.interface";
import { IPlayerLeft } from "@/interfaces/memotest/player.interface";
import { AppDispatch, RootState } from "@/store";
import {
  removePlayer,
  setGameFinished,
  setPlayerTurn,
} from "@/store/slices/memotest";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContract } from "./useContract";
import { useProvider } from "./useProvider";
import { useSocket } from "./useSocket";

const initMemotestTable: ICard[] = new Array(16)
  .fill(0)
  .map((v, index) => ({
    id: "0",
    image: "",
    revealed: false,
    perPosition: 0 + "", // NOTE Check per position when cards revealed
    position: index,
    revealedByPlayer: "",
  }));

export const useMemotest = () => {
  const { getObjectById, on, unsubscribe } = useProvider();
  const contract = useContract();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket(Namespace.memotest);
  const [signError, setSignError] = useState<
    "not-signed" | "signed-error" | "signed-correctly"
  >("not-signed");
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
  const [turnDetails, setWhoPlays] = useState<ITurnOnChain>({
    whoPlays: room.whoPlays ?? 1,
    lastTurnDate: 0,
    playerTurnDuration: 0,
  });
  const [timeByPlayer, setTimeByPlayer] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(
    room.players.find((p) => p.playerTableID === 1) as IPlayer
  );
  const [thisPlayer, setThisPlayer] = useState<IPlayer>(
    room.players.find(
      (p) => p.walletAddress === wallet.walletAddress
    ) as IPlayer
  );

  const onRevealCard = useCallback(
    (position: number) => {
      setWhoPlays((state) => ({
        ...state,
        lastTurnDate: Date.now(),
      }));
      socket.emit(SocketEventNames.turnOverCard, {
        position: position + 1,
      } as ISocket.ITurnOverCard);
    },
    [socket]
  );

  const handleSelectCard = useCallback(
    async ({
      position: alteredPosition,
      image,
      id,
    }: ISocket.ICardSelected) => {
      const position = alteredPosition - 1;
      let cardData!: ICard;
      console.log(
        await getObjectById<IGameBoard>(
          room.details.gameboardObjectId
        )
      );
      setCardsRevealed((state) => {
        return state.map((c) => {
          if (c.position === position) {
            cardData = {
              revealed: true,
              position,
              image,
              id,
              perPosition: c.perPosition,
              revealedByPlayer: c.revealedByPlayer,
            };
            return cardData;
          }
          return c;
        });
      });
      setTurn(({ flippedCardsAmount, flippedCards }) => {
        return {
          flippedCardsAmount: flippedCardsAmount + 1,
          flippedCards: [...flippedCards, cardData],
          status: "in-process",
        };
      });
    },
    [getObjectById, room.details.gameboardObjectId]
  );

  const goToNextTurn = useCallback(async (resp: ITurnOnChain) => {
    setTurn({
      flippedCardsAmount: 0,
      flippedCards: new Array(),
      status: "finished",
    });
    setWhoPlays(resp);
  }, []);

  const comproveFlippedCards = useCallback(async () => {
    const [card1, card2] = turn.flippedCards;
    if (card1.id === card2.id) {
      setCardsRevealed((state) => {
        const newState = [...state];
        newState[card1.position].revealedByPlayer =
          currentPlayer?.walletAddress;
        newState[card1.position].perPosition =
          card2.position + 1 + "";
        newState[card2.position].revealedByPlayer =
          currentPlayer?.walletAddress;
        newState[card2.position].perPosition =
          card1.position + 1 + "";
        return newState;
      });
    } else {
      setTimeout(() => {
        setCardsRevealed((state) => {
          const newState = [...state];
          newState[card1.position].revealed = false;
          newState[card1.position].clicked = false;
          newState[card2.position].revealed = false;
          newState[card2.position].clicked = false;
          return newState;
        });
      }, 3000);
    }
    if (wallet.walletAddress === currentPlayer.walletAddress) {
      setWhoPlays((state) => ({
        ...state,
        lastTurnDate: Date.now(),
        playerTurnDuration: 45000,
      }));
      try {
        await contract.turnOverCard(
          room.details.gameboardObjectId as string,
          Number(card1.id),
          [card1.position + 1, card2.position + 1]
        );
      } catch (error) {
        setSignError("signed-error");
      }
      socket.emit(SocketEventNames.changeTurn);
      // setCardsRevealed((state) => {
      //   const newState = [...state];
      //   newState[card1.position].revealedByPlayer = "";
      //   newState[card1.position].perPosition = 0 + "";
      //   newState[card2.position].revealedByPlayer = "";
      //   newState[card2.position].perPosition = 0 + "";
      //   newState[card1.position].revealed = false;
      //   newState[card1.position].clicked = false;
      //   newState[card2.position].revealed = false;
      //   newState[card2.position].clicked = false;
      //   return newState;
      // });
    }
  }, [
    turn.flippedCards,
    wallet.walletAddress,
    currentPlayer.walletAddress,
    socket,
    contract,
    room.details.gameboardObjectId,
  ]);

  // Init currentPlayer
  useEffect(() => {
    setCurrentPlayer(
      room.players.find(
        (p) => p.playerTableID === turnDetails.whoPlays
      ) as IPlayer
    );
    setThisPlayer(
      room.players.find(
        (p) => p.walletAddress === thisPlayer.walletAddress
      ) as IPlayer
    );
  }, [
    thisPlayer.walletAddress,
    wallet.walletAddress,
    turnDetails.whoPlays,
    room,
  ]);

  useEffect(() => {
    let cardTurnedOverSubs: number;
    let cardsPerFoundSubs: number;
    on<ISocket.ICardTurnedOver>(
      "CardTurnedOver",
      handleSelectCard
    ).then((id) => (cardTurnedOverSubs = id));
    on<ISocket.ICardTurnedOver>("CardsPerFound", console.log).then(
      (id) => (cardsPerFoundSubs = id)
    );
    return () => {
      unsubscribe(cardTurnedOverSubs);
      unsubscribe(cardsPerFoundSubs);
    };
  }, [handleSelectCard, on, unsubscribe]);

  useEffect(() => {
    let turnChangedOverSubs: number;
    on<ITurnOnChain>("TurnChanged", goToNextTurn).then(
      (id) => (turnChangedOverSubs = id)
    );
    return () => {
      unsubscribe(turnChangedOverSubs);
    };
  }, [goToNextTurn, on, unsubscribe]);

  /*
   * Game logic
   */

  // Check flipped cards
  useEffect(() => {
    if (turn.flippedCardsAmount < 2) return;
    comproveFlippedCards();
  }, [comproveFlippedCards, turn]);

  // Change player turn
  useEffect(() => {
    if (turn.status !== "finished") return;

    const fn = async () => {
      const resp = await getObjectById<IGameBoard>(
        room.details.gameboardObjectId
      );
      if (resp.data.cards_found < 8) {
        dispatch(
          setPlayerTurn({
            playerId: turnDetails.whoPlays as number,
          })
        );
        setTurn({
          flippedCardsAmount: 0,
          flippedCards: new Array(),
          status: "started",
        });
        return;
      }

      // Check who win
      const playersScore: {
        walletAddress: string;
        cardsRevealed: number;
      }[] = [];

      cardsRevealed.forEach(({ revealedByPlayer }) => {
        const player = playersScore.find(
          (p) => p.walletAddress === revealedByPlayer
        );
        if (player) player.cardsRevealed += 1;
        else
          playersScore.push({
            walletAddress: revealedByPlayer as string,
            cardsRevealed: 1,
          });
      });

      const winners: {
        walletAddress: string;
        cardsRevealed: number;
      }[] = [playersScore[0]];

      for (let i = 1; i < playersScore.length; i++) {
        if (
          winners[0].cardsRevealed < playersScore[i].cardsRevealed
        ) {
          winners[0] = playersScore[i];
        } else if (
          winners[0].cardsRevealed === playersScore[i].cardsRevealed
        ) {
          winners.push(playersScore[i]);
        }
      }
      if (winners.length === 1) {
        dispatch(
          setGameFinished({
            matchStatus: {
              status: "victory",
              winners: [winners[0]],
              players: playersScore,
            },
          })
        );
      } else {
        dispatch(
          setGameFinished({
            matchStatus: {
              status: "withdraw",
              winners: winners,
              players: playersScore,
            },
          })
        );
      }
    };

    fn();
  }, [
    cardsRevealed,
    dispatch,
    getObjectById,
    room.details.gameboardObjectId,
    turn.status,
    turnDetails.whoPlays,
  ]);

  // On player left
  const onPlayerLeft = useCallback(
    async (data: IPlayerLeft) => {
      const {
        data: { who_plays, cards_found },
      } = await getObjectById<IGameBoard>(
        room.details.gameboardObjectId
      );
      // room.players.length - 1 because the state neither the contract were updated yet  when this method is excecuted
      if (cards_found < 8 && room.players.length - 1 > 1) {
        dispatch(removePlayer(data));
        dispatch(setPlayerTurn({ playerId: who_plays }));
      } else {
        dispatch(
          setGameFinished({
            matchStatus: {
              status: "victory",
              winners: [
                {
                  cardsRevealed: cardsRevealed.filter(
                    (c) =>
                      c?.revealedByPlayer === wallet.walletAddress
                  )?.length,
                  walletAddress: wallet.walletAddress,
                },
              ],
              players: [
                {
                  cardsRevealed: cardsRevealed.filter(
                    (c) =>
                      c?.revealedByPlayer === wallet.walletAddress
                  )?.length,
                  walletAddress: wallet.walletAddress,
                },
              ],
            },
          })
        );
      }
    },
    [
      getObjectById,
      room.details.gameboardObjectId,
      room.players,
      cardsRevealed,
      dispatch,
      wallet.walletAddress,
    ]
  );

  useEffect(() => {
    socket.listen(SocketEventNames.onPlayerLeft, onPlayerLeft);
    return () => {
      socket.off(SocketEventNames.onPlayerLeft, onPlayerLeft);
    };
  });

  useEffect(() => {
    if (
      (turnDetails.lastTurnDate === 0 &&
        turnDetails.playerTurnDuration === 0) ||
      !thisPlayer.isCurrentPlayer
    )
      return;
    const _intervalId = setInterval(() => {
      const usedTimeByPlayer = Date.now() - turnDetails.lastTurnDate;
      setTimeByPlayer(
        Math.round(
          (turnDetails.playerTurnDuration - usedTimeByPlayer) / 1000
        )
      );

      if (usedTimeByPlayer >= turnDetails.playerTurnDuration) {
        if (turn.flippedCardsAmount > 1) {
          setSignError("signed-error");
        }
        socket.emit(SocketEventNames.requestTimeOut);
        clearInterval(_intervalId);
      }
    }, 1000);
    return () => {
      clearInterval(_intervalId);
    };
  }, [
    socket,
    thisPlayer.isCurrentPlayer,
    turn.flippedCardsAmount,
    turnDetails.lastTurnDate,
    turnDetails.playerTurnDuration,
  ]);

  useEffect(() => {
    if (signError !== "signed-error") return;

    setCardsRevealed((state) => {
      const [card1, card2] = turn.flippedCards;
      return state
        .map((c) => {
          if (c.id === card1.id) {
            return {
              ...c,
              revealed: false,
              clicked: false,
              revealedByPlayer: "",
            };
          }
          return c;
        })
        .map((c) => {
          if (c.id === card2.id) {
            return {
              ...c,
              revealed: false,
              clicked: false,
              revealedByPlayer: "",
            };
          }
          return c;
        });
    });

    setSignError("not-signed");
  }, [signError, turn.flippedCards]);

  return {
    whoPlays: memotestState.currentRoom?.whoPlays ?? 1,
    players: room.players as IPlayer[],
    room: memotestState.currentRoom,
    currentPlayer,
    cardsRevealed,
    onRevealCard,
    timeByPlayer,
    thisPlayer,
    turn,
  };
};
