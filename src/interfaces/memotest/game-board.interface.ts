import { RoomStatus } from "../../types/RoomStatus";
import { IGameConfig } from "./game-config.interface";

export interface IGameBoard {
  id: string;
  cards: {
    type: string;
    fields: {
      found_by: string;
      id: string;
      image: string;
      location: string;
      per_location: string;
    };
  }[];
  players: {
    type: string;
    fields: {
      addr: string;
      amount_betted: string;
      can_play: boolean;
      found_amount: string;
      id: string;
    };
  }[];
  status: RoomStatus;
  cards_found: number;
  prize: { fields: any };
  who_plays: number;
  config: { fields: IGameConfig };
}
