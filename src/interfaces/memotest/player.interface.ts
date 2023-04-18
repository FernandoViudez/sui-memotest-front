export interface IPlayerJoined {
  id: number; // position at the table
  address: string;
}
export interface IPlayerLeft extends IPlayerJoined {}
