import { RoomStatus } from "../../types/RoomStatus";
import { IGameConfig } from "./game-config.interface";

export interface IGameBoard {
  id: string;
  cards: { fields: any[] };
  players: { fields: any[] };
  status: RoomStatus;
  cards_found: number;
  prize: { fields: any };
  who_plays: number;
  config: { fields: IGameConfig };
}
