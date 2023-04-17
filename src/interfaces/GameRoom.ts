import { GameStatus, GameType } from "@/enums";
import { IPlayer } from "./Player";

export interface IGameRoom {
  id: string;
  roomCode: string; // roomCode -> roomId : gameBoardObjectId
  isPrivate: boolean;
  owner: string;
  gameStatus: GameStatus;
  type: GameType;
}

export interface ICurrentRoom {
  details: IGameRoom;
  players: IPlayer[];
  whoPlays: number;
}
