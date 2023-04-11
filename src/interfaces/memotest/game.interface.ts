export interface StartGame {
  roomId: string;
}

export interface TurnOverCard {
  roomId: string;
  position: number;
}

export interface CardTurnedOver {
  id: string;
  position: number;
  image: string;
}
export interface CardSelected extends CardTurnedOver {}
