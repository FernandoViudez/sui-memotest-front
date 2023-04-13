import { IGameRoom } from "@/interfaces/GameRoom";
import { IPlayer } from "@/interfaces/Player";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type MemotestSlice = {
  rooms: IGameRoom[];
  currentRoom?: IGameRoom;
  game: {
    ready: boolean;
  };
};

const _name = "memotest";

const _initialState: MemotestSlice = {
  rooms: [
    {
      //TODO Remove when development is done
      id: "1",
      isAvailable: true,
      isPrivate: false,
      name: "Test Room",
      owner:
        "0x4a95d662730997901b91aaf6c79ddea8c711a55b7770eff0bd5a909ecf749098",
      players: [
        {
          walletAddress:
            "0x4a95d662730997901b91aaf6c79ddea8c711a55b7770eff0bd5a908",
          name: "John Doe",
        },
      ],
      roomStatus: "pending",
      type: "memotest",
    },
  ],
  game: {
    ready: false,
  },
};

export const gameSlice = createSlice({
  name: _name,
  initialState: _initialState,
  reducers: {
    addRoom: (state, action: PayloadAction<IGameRoom>) => {
      state.rooms.push({ ...action.payload });
    },
    enterRoom: (
      state,
      {
        payload,
      }: PayloadAction<{
        currentRoom: IGameRoom;
        newPlayer: IPlayer;
        isOwner: boolean;
      }>
    ) => {
      state.currentRoom = payload.currentRoom;
      state.currentRoom = {
        ...state.currentRoom,
        players: [...state.currentRoom.players, payload.newPlayer],
      };
      if (payload.isOwner)
        state.currentRoom.owner = payload.newPlayer.walletAddress;
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.currentRoom?.players.push(action.payload);
    },
    playersReady: (state) => {
      if (state.currentRoom)
        state.currentRoom.roomStatus = "ready-to-play";
    },
    changeGameState: (state) => {
      return {
        ...state,
        game: {
          ready: !state.game.ready,
        },
      };
    },
    cancelGame: (state) => {
      if (state.currentRoom) state.currentRoom.roomStatus = "pending";
    },
    exitRoom: (state) => {
      state.currentRoom = undefined;
    },
    deleteRoom: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        rooms: state.rooms.filter((r) => r.id === action.payload),
      };
    },
  },
});

export const {
  enterRoom,
  addPlayer,
  addRoom,
  changeGameState,
  playersReady,
  cancelGame,
  exitRoom,
} = gameSlice.actions;
