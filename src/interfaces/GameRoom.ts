import { IPlayer } from "./Player";

export interface IGameRoom {
  name: string;
  players: IPlayer[];
  isAvailable: boolean;
  id: string;
  isPrivate: boolean;
  type: "memotest"; // | 'trivia' | etc...
}
