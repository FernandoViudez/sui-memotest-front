import { TransactionBlock } from "@mysten/sui.js";
import { WalletContextState } from "@suiet/wallet-kit";
import { environment } from "../environment/enviornment";

export class MemotestContract {
  constructor(private readonly wallet: WalletContextState) {}

  private async splitCoin(requiredBalance: number) {
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(requiredBalance)]);
    return {
      tx,
      coin,
    };
  }

  async createGame(balanceToBet: number): Promise<string> {
    const { tx, coin } = await this.splitCoin(balanceToBet);
    tx.moveCall({
      target: `${environment.memotest.package}::memotest::new_game`,
      arguments: [tx.pure(environment.memotest.config), coin],
    });
    tx.transferObjects([coin], tx.pure(this.wallet.address));
    // TODO: research how to assign dynamic gas budget
    tx.setGasBudget(9000000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
      options: {
        showEffects: true,
      },
    });
    const gameBoard = res?.effects?.created?.find(
      (el) => (el.owner as any)["Shared"]
    );
    return gameBoard?.reference.objectId as string;
  }

  async joinRoom(gameBoard: string, balanceToBet: number) {
    const { coin, tx } = await this.splitCoin(balanceToBet);
    tx.moveCall({
      target: `${environment.memotest.package}::memotest::join`,
      arguments: [tx.pure(gameBoard), coin],
    });
    tx.transferObjects([coin], tx.pure(this.wallet.address));
    tx.setGasBudget(9000000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
    });
    console.log("[Join]", res?.effects?.status);
  }

  async startGame(gameBoard: string) {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${environment.memotest.package}::memotest::start_game`,
      arguments: [tx.pure(gameBoard)],
    });
    tx.setGasBudget(9000000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
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
      arguments: [
        tx.pure(gameBoard),
        tx.pure(cardId),
        tx.pure(cardsLocation),
      ],
    });
    tx.setGasBudget(10000);
    const res = await this.wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx as any,
      options: {
        showEffects: true,
      },
    });
    console.log("[Turn Over Card]", res?.effects?.status);
  }
}
