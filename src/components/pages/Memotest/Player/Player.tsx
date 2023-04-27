import { IPlayer } from "@/interfaces/Player";
import { memo, useState } from "react";
import styles from "./Player.module.css";
import { useWallet } from "@suiet/wallet-kit";

const PlayerComponent = ({
  player,
  timeByPlayer,
}: {
  timeByPlayer: number;
  player: IPlayer;
}) => {
  const wallet = useWallet();
  return (
    <div className="d-flex w-100 m-auto flex-column justify-content-center align-items-center position-relative">
      <figure className="mb-2 w-100 d-flex justify-content-center position-relative">
        <div
          className={
            player.isCurrentPlayer
              ? `${styles.playerCard} ${styles.currentPlayer} ${
                  styles["player-" + player.playerTableID]
                }`
              : `${styles.playerCard} ${
                  styles["player-" + player.playerTableID]
                }`
          }
        ></div>
      </figure>
      <span
        className={`text-secondary ${
          player.walletAddress == wallet.address ? styles.meIndicator : ""
        }`}
      >
        {player?.name || player.walletAddress.slice(0, 7) + "..."}
      </span>
      {player.isCurrentPlayer && timeByPlayer < 11 && timeByPlayer > 0 && (
        <span className={`text-light ${styles.playerTime}`}>
          {timeByPlayer}
        </span>
      )}
    </div>
  );
};

export const Player = memo(PlayerComponent);
