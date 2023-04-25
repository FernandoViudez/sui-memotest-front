import Image from "next/image";
import { memo, useMemo } from "react";
import placeholder from "../../../../../public/placeholder.png";
import trantorianImg from "../../../../../public/tt-memo-card.png";
import styles from "./MemotestCard.module.css";

interface ComponentProps {
  position: number;
  image: string;
  isFlipped: boolean;
  isDiscovered: boolean;
  cannotBeFlipped: boolean;
  onRevealCard: (position: number) => void;
}

const MemotestCardComponent = ({
  position,
  isFlipped,
  isDiscovered,
  image,
  onRevealCard,
  cannotBeFlipped,
}: ComponentProps) => {
  const onClickCard = () => {
    if (isFlipped || cannotBeFlipped) return;
    onRevealCard(position);
  };

  const setFlipAnimationClass = useMemo(
    () =>
      `${
        isFlipped
          ? styles.flipAnimContainer + " " + styles.reveal
          : styles.flipAnimContainer
      }`,
    [isFlipped]
  );

  const setDisableCursorClass = useMemo(
    () =>
      `${styles.memotestCard} ${
        isFlipped || cannotBeFlipped || isDiscovered ? styles.disableCursor : ""
      }`,
    [isFlipped, isDiscovered, cannotBeFlipped]
  );

  return (
    <div className={setDisableCursorClass} onClick={onClickCard}>
      <div className={setFlipAnimationClass}>
        <div className={styles.faceDown}>
          <Image src={trantorianImg} fill alt="front" />
        </div>
        <div className={styles.cardBack}>
          <Image
            className={isDiscovered ? styles.revealedCard : ""}
            src={image || placeholder}
            fill
            alt="back"
          />
        </div>
      </div>
    </div>
  );
};

export const MemotestCard = memo(MemotestCardComponent);
