import Image from "next/image";
import { memo, useMemo } from "react";
import placeholder from "../../../../../public/placeholder.png";
import trantorianImg from "../../../../../public/tt-memo-card.png";
import styles from "./MemotestCard.module.css";

interface ComponentProps {
  position: number;
  revealedInTurn: boolean;
  cannotBeFlipped: boolean;
  onRevealCard: (position: number) => void;
}

const MemotestCardComponent = ({
  position,
  onRevealCard,
  revealedInTurn,
  cannotBeFlipped,
}: ComponentProps) => {
  const onClickCard = () => {
    if (revealedInTurn || cannotBeFlipped) return;
    onRevealCard(position);
  };

  const setFlipAnimationClass = useMemo(
    () =>
      `${
        revealedInTurn
          ? styles.flipAnimContainer + " " + styles.reveal
          : styles.flipAnimContainer
      }`,
    [revealedInTurn]
  );

  const setDisableCursorClass = useMemo(
    () =>
      `${styles.memotestCard} ${
        revealedInTurn || cannotBeFlipped ? styles.disableCursor : ""
      }`,
    [revealedInTurn, cannotBeFlipped]
  );

  return (
    <div className={setDisableCursorClass} onClick={onClickCard}>
      <div className={setFlipAnimationClass}>
        <div className={styles.faceDown}>
          <Image
            className={revealedInTurn ? styles.revealedCard : ""}
            src={trantorianImg}
            fill
            alt="front"
          />
        </div>
        <div className={styles.cardBack}>
          <Image
            className={revealedInTurn ? styles.revealedCard : ""}
            src={placeholder}
            fill
            alt="back"
          />
        </div>
      </div>
    </div>
  );
};

export const MemotestCard = memo(MemotestCardComponent);
