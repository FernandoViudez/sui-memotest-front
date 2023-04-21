import { ICard } from "@/interfaces/Card";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { ITurn } from "@/interfaces/Turn";
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
  const { getObjectById } = useProvider();
  const contract = useContract();
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket(Namespace.memotest);
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

  const [whoPlays, setWhoPlays] = useState<number>(
    room.whoPlays ?? 1
  );

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
      console.log("CLICK POSITION", position);
      console.log("ALTERED POSITION FOR BACK", {
        position: position + 1,
      });
      socket.emit(SocketEventNames.turnOverCard, {
        position: position + 1,
      } as ISocket.ITurnOverCard);

      // setCardsRevealed((state) => {
      //   const newState = [...state];
      //   newState[position] = {
      //     ...newState[position],
      //     clicked: true,
      //   };
      //   return newState;
      // });
    },
    [socket]
  );

  const handleSelectCard = useCallback(
    ({
      position: alteredPosition,
      image,
      id,
    }: ISocket.ICardSelected) => {
      const position = alteredPosition - 1;
      let cardData!: ICard;

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
    []
  );

  // const handleRevealCard = useCallback(
  //   ({ position, image, id }: ISocket.ICardTurnedOver) => {
  //     console.log("on reveal ", {
  //       position,
  //       image,
  //       id,
  //     });

  //     let cardData!: ICard;

  //     setCardsRevealed((state) => {
  //       return state.map((c) => {
  //         if (c.position === position) {
  //           cardData = {
  //             revealed: true,
  //             position,
  //             image,
  //             id,
  //             perPosition: c.perPosition,
  //             revealedByPlayer: c.revealedByPlayer,
  //           };
  //           return cardData;
  //         }
  //         return c;
  //       });
  //     });
  //   },
  //   []
  // );

  const goToNextTurn = useCallback(
    (resp: any) => {
      setTurn({
        flippedCardsAmount: 0,
        flippedCards: new Array(),
        status: "finished",
      });

      setWhoPlays(resp.whoPlays);
    },
    [setTurn]
  );

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
      }, 2000);
    }
    if (wallet.walletAddress === currentPlayer.walletAddress) {
      await contract.turnOverCard(
        room.details.gameboardObjectId as string,
        Number(card1.id),
        [card1.position + 1, card2.position + 1]
      );
      socket.emit("change-turn");
    }
  }, [
    room.details.gameboardObjectId,
    currentPlayer.walletAddress,
    wallet.walletAddress,
    turn.flippedCards,
    contract,
    socket,
  ]);

  // Init currentPlayer
  useEffect(() => {
    setCurrentPlayer(
      room.players.find(
        (p) => p.playerTableID === whoPlays
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
    whoPlays,
    room,
  ]);

  // Listen socket messages

  // useEffect(() => {
  //   socket.listen(SocketEventNames.onCardSelected, handleSelectCard);
  //   return () => {
  //     socket.off(SocketEventNames.onCardSelected, handleSelectCard);
  //   };
  // }, [handleSelectCard, socket]);

  useEffect(() => {
    socket.listen(
      SocketEventNames.onCardTurnedOver,
      handleSelectCard
      // handleSelectCard
    );
    return () => {
      socket.off(SocketEventNames.onCardTurnedOver, handleSelectCard);
    };
  }, [handleSelectCard, socket]);

  useEffect(() => {
    socket.listen(SocketEventNames.onTurnChanged, goToNextTurn);
    return () => {
      socket.off(SocketEventNames.onTurnChanged, goToNextTurn);
    };
  }, [goToNextTurn, socket]);

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
            playerId: whoPlays as number,
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

      if (playersScore.length === 1) {
        dispatch(
          setGameFinished({
            matchStatus: {
              status: "victory",
              winners: [winners[0]],
            },
          })
        );
      } else {
        dispatch(
          setGameFinished({
            matchStatus: {
              status: "withdraw",
              winners: winners,
            },
          })
        );
      }
    };

    fn();
  }, [
    dispatch,
    getObjectById,
    room.details.gameboardObjectId,
    turn.status,
    whoPlays,
  ]);

  // On player left
  const onPlayerLeft = useCallback(
    async (data: IPlayerLeft) => {
      const response = await getObjectById<IGameBoard>(
        room.details.gameboardObjectId
      );

      dispatch(removePlayer(data));
      dispatch(setPlayerTurn({ playerId: response.data.who_plays }));
    },
    [dispatch, getObjectById, room.details.gameboardObjectId]
  );

  useEffect(() => {
    socket.listen(SocketEventNames.onPlayerLeft, onPlayerLeft);
    return () => {
      socket.off(SocketEventNames.onPlayerLeft, onPlayerLeft);
    };
  });

  return {
    turn,
    onRevealCard,
    whoPlays: memotestState.currentRoom?.whoPlays,
    cardsRevealed,
    thisPlayer,
    room: memotestState.currentRoom,
    currentPlayer,
    players: room.players as IPlayer[],
  };
};
