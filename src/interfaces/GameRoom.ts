import { GameStatus, GameType } from "@/enums";
import { IPlayer } from "./Player";

// roomCode -> roomId : gameBoardObjectId
export interface IGameRoom {
  gameboardObjectId: string;
  gameStatus: GameStatus;
  isPrivate: boolean;
  type: GameType;
  owner: string;
  id: string;
  playersInRoom?: number;
}

export interface ICurrentRoom {
  details: IGameRoom;
  players: IPlayer[];
  whoPlays: number;
  winner?: {
    status: "victory" | "withdraw";
    winners: { walletAddress: string; cardsRevealed: number }[];
    players: { walletAddress: string; cardsRevealed: number }[];
  };
}
