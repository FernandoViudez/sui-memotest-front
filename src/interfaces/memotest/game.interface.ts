export interface IStartGame {
  roomId: string;
}

export interface ITurnOverCard {
  roomId: string;
  position: number;
}

export interface ICardTurnedOver {
  id: string;
  position: number;
  image: string;
}
export interface ICardSelected extends ICardTurnedOver {}
