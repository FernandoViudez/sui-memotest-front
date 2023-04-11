// emitters

export interface CreateRoom {
  signature: string;
  publicKey: string;
  gameBoardObjectId: string;
}

export interface JoinRoom {
  signature: string;
  publicKey: string;
  roomId: string;
}

// listeners
export interface RoomCreated {
  roomId: string;
}
