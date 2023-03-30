import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConnectionStatus = "connected" | "processing" | "disconnected";

interface IWalletInformation {
  walletAddress: string | string[];
  name?: string;
  wallet?: "Suit" | "MyAlgo" | "Pera";
}

interface IWalletError {
  connectionStatus: ConnectionStatus;
  error?: string;
}

type WalletSlice = IWalletInformation & IWalletError;

const _name = "walletSlice";

const _initialState: WalletSlice = {
  connectionStatus: "disconnected",
  walletAddress: "",
};

export const walletSlice = createSlice({
  initialState: _initialState,
  name: _name,
  reducers: {
    tryConnection: (state) => {
      state.connectionStatus = "processing";
    },
    setWalletInformation: (
      state,
      action: PayloadAction<IWalletInformation>
    ) => {
      state = {
        ...state,
        ...action.payload,
      };
    },
    setError: (state, action: PayloadAction<IWalletError>) => {
      state = {
        ...action.payload,
        ..._initialState,
      };
    },
  },
});

export const { tryConnection, setWalletInformation, setError } =
  walletSlice.actions;
