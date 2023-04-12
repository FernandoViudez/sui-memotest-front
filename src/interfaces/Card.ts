export interface ICard {
  position: number;
  image: string | null;
  revealed: boolean;
  id: string | null;
  revealedByPlayer?: string;
}
