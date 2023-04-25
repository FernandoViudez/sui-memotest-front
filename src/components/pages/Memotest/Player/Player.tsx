import { IPlayer } from "@/interfaces/Player";
// import Image from 'next/image';
import { memo } from "react";
import styles from "./Player.module.css";

const PlayerComponent = ({
  player,
  timeByPlayer,
}: {
  timeByPlayer: number;
  player: IPlayer;
}) => {
  return (
    <div className="d-flex w-100 m-auto flex-column justify-content-center align-items-center position-relative">
      <figure className="mb-2 w-100 d-flex justify-content-center position-relative">
        {/* Image */}
        <div
          className={
            player.isCurrentPlayer
              ? `${styles.playerCard} ${styles.currentPlayer}`
              : styles.playerCard
          }
        ></div>
      </figure>
      <span className="text-secondary mb-4">
        {player?.name || player.walletAddress.slice(0, 7) + "..."}
      </span>
      {player.isCurrentPlayer &&
        timeByPlayer < 11 &&
        timeByPlayer > 0 && (
          <span className={`text-light ${styles.playerTime}`}>
            {timeByPlayer}
          </span>
        )}
    </div>
  );
};

export const Player = memo(PlayerComponent);
