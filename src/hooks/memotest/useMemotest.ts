import { ICard } from "@/interfaces/Card";
import { ICurrentRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { ITurn } from "@/interfaces/Turn";
import * as ISocket from "@/interfaces/memotest/game.interface";
import { AppDispatch, RootState } from "@/store";
import { setPlayerTurn } from "@/store/slices/memotest";
import { SocketEventNames } from "@/types/memotest/socket-event-names.enum";
import { Namespace } from "@/types/socket-namespaces.enum";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useContract } from "./useContract";
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
    memotestState.currentRoom?.whoPlays ?? 1
  );

  console.log(
    memotestState.currentRoom?.players.find(
      (p) => p.playerTableID === 1
    ) as IPlayer
  );
  const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(
    memotestState.currentRoom?.players.find(
      (p) => p.playerTableID === 1
    ) as IPlayer
  );
  const [thisPlayer, setThisPlayer] = useState<IPlayer>(
    memotestState.currentRoom?.players.find(
      (p) => p.walletAddress === wallet.walletAddress
    ) as IPlayer
  );

  const onRevealCard = useCallback(
    (position: number) => {
      console.log("ON REVEAL CARD");
      socket.emit(SocketEventNames.turnOverCard, {
        position: position + 1,
      } as ISocket.ITurnOverCard);
    },
    [socket]
  );

  // NOTE: HANDLE SELECTED SOLO SE emite al usuario particular

  const handleSelectCard = useCallback(
    ({
      position: alteredPosition,
      image,
      id,
    }: ISocket.ICardSelected) => {
      const position = alteredPosition - 1;
      console.log("on select", { position, image, id });

      // hacer llamada al contrato cuando turn.cardsFlipped === 2
      // emitir evento en socket

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
      console.log(resp);
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
          newState[card2.position].revealed = false;
          return newState;
        });
      }, 2000);
    }

    if (wallet.walletAddress === currentPlayer.walletAddress) {
      console.log("CARDS POSITION", [
        card1.position + 1,
        card2.position + 1,
      ]);
      await contract.turnOverCard(
        memotestState.currentRoom?.details
          .gameboardObjectId as string,
        Number(card1.id),
        [card1.position + 1, card2.position + 1]
      );
      socket.emit("change-turn");
    }
  }, [
    memotestState.currentRoom?.details.gameboardObjectId,
    currentPlayer?.walletAddress,
    wallet.walletAddress,
    turn.flippedCards,
    contract,
    socket,
  ]);

  // Init currentPlayer
  useEffect(() => {
    // setCurrentPlayer({
    //   ...room.players.find((p) => p.playerTableID === whoPlays),
    // } as IPlayer);
    // setThisPlayer({
    //   ...room.players.find(
    //     (p) => p.walletAddress === thisPlayer.walletAddress
    //   ),
    // } as IPlayer);
    console.log("ANTES DE SETEAR CURRENT PLAYER WHO PLAYS", whoPlays);
    console.log(
      "ANTES DE SETEAR CURRENT PLAYER SET CURRENT PLAYER",
      currentPlayer
    );
    console.log(
      "ANTES DE SETEAR CURRENT PLAYER SET THIS PLAYER",
      thisPlayer
    );
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

  // Game logic
  useEffect(() => {
    if (turn.flippedCardsAmount < 2) return;
    console.log("SE EJECUTA FLIPPED CARDS");
    comproveFlippedCards();
  }, [comproveFlippedCards, turn]);

  // Change player turn
  useEffect(() => {
    turn;
    console.log("TURN CHANGED USE EFFECT");
    if (turn.status !== "finished") return;

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
  }, [dispatch, turn.status, whoPlays]);
  //[dispatch, turn.status, whoPlays]
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
