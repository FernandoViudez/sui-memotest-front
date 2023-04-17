export interface IPlayer {
  walletAddress: string;
  name?: string;
  icon?: string;
  playerTableID?: number; // player position at the table
  isCurrentPlayer?: boolean;
}
