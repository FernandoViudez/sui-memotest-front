export const enum GameStatus {
  Waiting = "waiting", // ~> esperando a que se una mas gente, es el default cuando se crea una nueva room
  Playing = "playing", // ~> juego in progress
  Finished = "finished", // ~> juego terminado
}
