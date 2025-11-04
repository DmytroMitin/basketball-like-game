
import React from 'react';
import { Vector2D, GameStatus, ShotResult } from '../types';
import {
  COURT_WIDTH,
  COURT_HEIGHT,
  BALL_RADIUS,
  HOOP_X,
  HOOP_Y,
  HOOP_DIAMETER,
  RIM_THICKNESS,
  BACKBOARD_X,
  BACKBOARD_Y,
  BACKBOARD_HEIGHT,
  BACKBOARD_WIDTH,
} from '../constants';

interface GameCourtProps {
  ballPosition: Vector2D;
  angle: number;
  power: number;
  gameStatus: GameStatus;
  score: number;
  attempts: number;
  shotResult: ShotResult;
}

const Scoreboard: React.FC<{ score: number; attempts: number }> = ({ score, attempts }) => (
  <div className="absolute top-4 left-4 text-white bg-black bg-opacity-40 p-4 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold">SCORE: {score}</h2>
    <p className="text-lg">ATTEMPTS: {attempts}</p>
  </div>
);

const ResultMessage: React.FC<{ shotResult: ShotResult }> = ({ shotResult }) => {
  if (!shotResult) return null;

  const isScored = shotResult === 'scored';
  const message = isScored ? 'SWISH!' : 'TRY AGAIN';
  const color = isScored ? 'text-green-400' : 'text-red-400';

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
      <h1 className={`text-8xl font-black animate-pulse ${color}`}>{message}</h1>
    </div>
  );
};

const GameCourt: React.FC<GameCourtProps> = ({
  ballPosition,
  angle,
  power,
  gameStatus,
  score,
  attempts,
  shotResult,
}) => {
  const aimIndicatorLength = Math.max(20, power * 1.5);

  return (
    <div
      className="relative bg-gradient-to-b from-indigo-800 to-indigo-500 overflow-hidden shadow-2xl rounded-lg"
      style={{ width: COURT_WIDTH, height: COURT_HEIGHT }}
    >
      {/* Wooden floor */}
      <div
        className="absolute bottom-0 w-full bg-orange-900"
        style={{ height: '50px', borderTop: '5px solid black' }}
      ></div>

      <Scoreboard score={score} attempts={attempts} />

      {/* Hoop */}
      <div
        className="absolute bg-white"
        style={{
          left: `${BACKBOARD_X}px`,
          top: `${BACKBOARD_Y}px`,
          width: `${BACKBOARD_WIDTH}px`,
          height: `${BACKBOARD_HEIGHT}px`,
        }}
      />
      <div
        className="absolute border-orange-600 rounded-full"
        style={{
          left: `${HOOP_X}px`,
          top: `${HOOP_Y - RIM_THICKNESS}px`,
          width: `${HOOP_DIAMETER}px`,
          height: `${RIM_THICKNESS * 2}px`,
          borderWidth: `${RIM_THICKNESS}px`,
          borderTopColor: 'transparent',
          transform: 'scaleX(1.3)',
        }}
      >
        {/* Net */}
         <div className="absolute left-1/2 -translate-x-1/2 top-1/2 w-full h-12 border-l border-r border-b border-gray-400 opacity-50" style={{clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)'}}></div>
      </div>


      {/* Aiming Indicator */}
      {gameStatus === GameStatus.Aiming && (
        <div
          className="absolute origin-left transition-all duration-100"
          style={{
            left: `${ballPosition.x}px`,
            top: `${ballPosition.y}px`,
            transform: `rotate(-${angle}deg)`,
          }}
        >
            <div className="h-1 bg-yellow-300 rounded-full" style={{width: `${aimIndicatorLength}px`}}></div>
        </div>
      )}

      {/* Ball */}
      <div
        className="absolute bg-orange-500 rounded-full flex items-center justify-center shadow-lg"
        style={{
          left: `${ballPosition.x - BALL_RADIUS}px`,
          top: `${ballPosition.y - BALL_RADIUS}px`,
          width: `${BALL_RADIUS * 2}px`,
          height: `${BALL_RADIUS * 2}px`,
          border: '2px solid black'
        }}
      />

      {gameStatus === GameStatus.Result && <ResultMessage shotResult={shotResult} />}
    </div>
  );
};

export default GameCourt;
