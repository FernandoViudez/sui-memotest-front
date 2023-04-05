import { IPlayer } from "./Player";

export interface IGameRoom {
  name: string;
  players: IPlayer[];
  isAvailable: boolean;
  id: string;
  isPrivate: boolean;
  owner: string;
  roomStatus: "pending" | "ready-to-play";
  type: "memotest"; // | 'trivia' | etc...
}
