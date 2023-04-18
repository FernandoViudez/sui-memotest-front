import { ICardTurnedOver } from "./memotest/game.interface";

export interface ICard extends ICardTurnedOver {
  id: string;
  image: string;
  position: number;
  revealed: boolean;
  revealedByPlayer?: string;
  perPosition: string;
}
