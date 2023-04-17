export interface IPlayerJoined {
  id: number; // position at the table
  walletAddress: string;
}
export interface IPlayerLeft extends IPlayerJoined {}
