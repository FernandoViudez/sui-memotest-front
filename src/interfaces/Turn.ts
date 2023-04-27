import { ICard } from "./Card";

export interface ITurn {
  status: "started" | "in-process" | "finished";
  flippedCardsAmount: number;
  flippedCards: ICard[];
}

export interface ITurnOnChain {
  whoPlays: number;
  playerTurnDuration: number;
  lastTurnDate: number;
}
