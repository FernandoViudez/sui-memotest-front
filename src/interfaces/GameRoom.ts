import { GameStatus, GameType } from "@/enums";

export interface IGameRoom {
  id: string;
  roomCode: string; // roomCode -> roomId : gameBoardObjectId
  isPrivate: boolean;
  owner: string;
  gameStatus: GameStatus;
  type: GameType;
}
