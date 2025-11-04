
import { Vector2D } from './types';

export const COURT_WIDTH = 1000;
export const COURT_HEIGHT = 600;

export const BALL_RADIUS = 15;
export const BALL_START_POS: Vector2D = { x: 100, y: COURT_HEIGHT - 100 };

export const HOOP_Y = COURT_HEIGHT / 2 + 30;
export const HOOP_X = COURT_WIDTH - 200;
export const HOOP_DIAMETER = 70;
export const RIM_THICKNESS = 8;
export const RIM_Y = HOOP_Y - RIM_THICKNESS / 2;

export const BACKBOARD_WIDTH = 8;
export const BACKBOARD_HEIGHT = 100;
export const BACKBOARD_X = HOOP_X + HOOP_DIAMETER;
export const BACKBOARD_Y = HOOP_Y - 60;

export const GRAVITY = 0.5;
export const BOUNCE_DAMPING = 0.7;
export const AIR_DAMPING = 0.998;
export const POWER_MULTIPLIER = 0.35;
