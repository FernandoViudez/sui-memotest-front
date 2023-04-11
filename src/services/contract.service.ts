import { CoinBalance, TransactionBlock } from "@mysten/sui.js";
import { WalletContextState } from "@suiet/wallet-kit";
import { environment } from "../environment/enviornment";

export class MemotestContract {
  constructor(private readonly wallet: WalletContextState) {}

  // TODO: Add split coin tx to the same tx block for other txns
  private async splitCoin(requiredBalance: number) {
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(requiredBalance)]);
    tx.transferObjects([coin], tx.pure(this.wallet.address));
    const result = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });
    return (result.effects?.created as any)[0].reference.objectId as string;
  }

  async createGame(balanceToBet: number) {
    const coinForBet = await this.splitCoin(balanceToBet);
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${environment.memotest.package}::memotest::new_game`,
      arguments: [tx.pure(environment.memotest.config), tx.pure(coinForBet)],
    });
    // TODO: research how to assign dynamic gas budget
    tx.setGasBudget(1000000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });
    return (res?.effects?.created as any)[0].reference.objectId;
  }

  async joinRoom(gameBoard: string, balanceToBet: number) {
    const coinForBet = await this.splitCoin(balanceToBet);
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${environment.memotest.package}::memotest::join`,
      arguments: [tx.pure(gameBoard), tx.pure(coinForBet)],
    });
    tx.setGasBudget(10000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });
    console.log("[Join]", res?.effects?.status);
  }

  async startGame(gameBoard: string) {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${environment.memotest.package}::memotest::start_game`,
      arguments: [tx.pure(gameBoard)],
    });
    tx.setGasBudget(10000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });
    console.log("[Start Game]", res?.effects?.status);
  }

  async turnOverCard(
    gameBoard: string,
    cardId: number,
    cardsLocation: number[]
  ) {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${environment.memotest.config}::memotest::turn_card_over`,
      arguments: [tx.pure(gameBoard), tx.pure(cardId), tx.pure(cardsLocation)],
    });
    tx.setGasBudget(10000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: {
        showEffects: true,
      },
    });
    console.log("[Turn Over Card]", res?.effects?.status);
  }
}
