// emitters

export interface ICreateRoom {
  signature: string;
  publicKey: string;
  gameBoardObjectId: string;
}

export interface IJoinRoom {
  signature: string;
  publicKey: string;
  roomId: string;
}

// listeners
export interface IRoomCreated {
  roomId: string;
}
