export interface IPlayerJoined {
  id: number; // position at the table
  roomCode: number;
}
export interface IPlayerLeft extends IPlayerJoined {}
