
export interface Vector2D {
  x: number;
  y: number;
}

export enum GameStatus {
  Aiming,
  InFlight,
  Result,
}

export type ShotResult = 'scored' | 'missed' | null;
