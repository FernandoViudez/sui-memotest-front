// emitters

export interface ICreateRoom {
  signature: string;
  publicKey: string;
  gameBoardObjectId: string;
  isPrivate: boolean;
}

export interface IJoinRoom {
  signature: string;
  publicKey: string;
  roomId: string;
}

// listeners
export interface IRoomCreated {
  id: string;
  code: string;
  owner: string;
  status: string;
  isPrivate: boolean;
}

export interface IRoomResponse {
  id: string;
  code: string;
  owner: string;
  status: string;
  isPrivate: boolean;
  playersInRoom: number;
}
