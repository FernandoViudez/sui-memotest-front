import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ConnectionStatus = "connected" | "processing" | "disconnected";

interface IWalletInformation {
  walletAddress: string;
  name?: string;
  walletName?: string;
}

interface IWalletError {
  connectionStatus: ConnectionStatus;
  error?: string;
}

type WalletSlice = IWalletInformation & IWalletError;

const _name = "wallet";

const _initialState: WalletSlice = {
  connectionStatus: "disconnected",
  walletAddress: "",
};

export const walletSlice = createSlice({
  initialState: _initialState,
  name: _name,
  reducers: {
    resetWallet: (state) => {
      return {
        ..._initialState,
      };
    },
    setWalletInformation: (
      state,
      action: PayloadAction<IWalletInformation>
    ) => {
      return {
        ...action.payload,
        connectionStatus: "connected",
      };
    },
    setError: (state, action: PayloadAction<IWalletError>) => {
      return {
        ...action.payload,
        ..._initialState,
      };
    },
  },
});

export const { setWalletInformation, setError, resetWallet } =
  walletSlice.actions;
