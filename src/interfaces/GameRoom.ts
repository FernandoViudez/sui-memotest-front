export interface IGameRoom {
  isAvailable: boolean;
  id: string;
  isPrivate: boolean;
  roomCode: string; // roomCode -> roomId : gameBoardObjectId
  owner: string;
  roomStatus: "pending" | "ready-to-play";
  type: "memotest"; // | 'trivia' | etc...
}

// Example
// {
//   id: "",
//   isAvailable: false,
//   isPrivate: true,
//   owner: "",
//   roomCode: "",
//   roomStatus: "pending",
//   type: "memotest",
// },
