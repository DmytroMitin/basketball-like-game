import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCourt from './components/GameCourt';
import Controls from './components/Controls';
import { Vector2D, GameStatus, ShotResult } from './types';
import {
  COURT_WIDTH,
  COURT_HEIGHT,
  BALL_RADIUS,
  BALL_START_POS,
  HOOP_X,
  HOOP_DIAMETER,
  RIM_Y,
  BACKBOARD_X,
  BACKBOARD_Y,
  BACKBOARD_HEIGHT,
  GRAVITY,
  BOUNCE_DAMPING,
  AIR_DAMPING,
  POWER_MULTIPLIER,
} from './constants';

function App() {
  const [ballPosition, setBallPosition] = useState<Vector2D>(BALL_START_POS);
  const ballVelocityRef = useRef<Vector2D>({ x: 0, y: 0 });
  const prevBallPositionRef = useRef<Vector2D>(BALL_START_POS);

  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(50);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Aiming);
  
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shotResult, setShotResult] = useState<ShotResult>(null);

  const animationFrameId = useRef<number>();
  const hasScoredRef = useRef(false);

  const handleShoot = () => {
    if (gameStatus !== GameStatus.Aiming) return;

    setAttempts((prev) => prev + 1);
    hasScoredRef.current = false;
    setShotResult(null);

    const angleInRadians = (angle * Math.PI) / 180;
    const initialVelocityX = Math.cos(angleInRadians) * power * POWER_MULTIPLIER;
    const initialVelocityY = -Math.sin(angleInRadians) * power * POWER_MULTIPLIER;

    ballVelocityRef.current = { x: initialVelocityX, y: initialVelocityY };
    setGameStatus(GameStatus.InFlight);
  };

  const resetShot = useCallback(() => {
    setBallPosition(BALL_START_POS);
    ballVelocityRef.current = { x: 0, y: 0 };
    setGameStatus(GameStatus.Aiming);
    setShotResult(null);
  }, []);

  const handleResetGame = () => {
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
    resetShot();
  };

  const gameLoop = useCallback(() => {
    let newPos = { ...ballPosition };
    let newVel = { ...ballVelocityRef.current };
    
    prevBallPositionRef.current = { ...ballPosition };

    // Apply physics
    newVel.y += GRAVITY;
    newVel.x *= AIR_DAMPING;
    newVel.y *= AIR_DAMPING;
    newPos.x += newVel.x;
    newPos.y += newVel.y;
    
    // Wall collisions
    if (newPos.x - BALL_RADIUS < 0) {
      newPos.x = BALL_RADIUS;
      newVel.x *= -BOUNCE_DAMPING;
    }
    if (newPos.x + BALL_RADIUS > COURT_WIDTH) {
        newPos.x = COURT_WIDTH - BALL_RADIUS;
        newVel.x *= -BOUNCE_DAMPING;
    }

    // Ceiling collision
    if (newPos.y - BALL_RADIUS < 0) {
        newPos.y = BALL_RADIUS;
        newVel.y *= -BOUNCE_DAMPING;
    }

    // Floor collision
    if (newPos.y + BALL_RADIUS > COURT_HEIGHT) {
        newPos.y = COURT_HEIGHT - BALL_RADIUS;
        newVel.y *= -BOUNCE_DAMPING;
    }

    // Backboard collision
    if (
      newPos.x + BALL_RADIUS > BACKBOARD_X &&
      newPos.x < BACKBOARD_X &&
      newPos.y > BACKBOARD_Y &&
      newPos.y < BACKBOARD_Y + BACKBOARD_HEIGHT
    ) {
      newPos.x = BACKBOARD_X - BALL_RADIUS;
      newVel.x *= -BOUNCE_DAMPING;
    }

    // Rim collision
    const frontRim = { x: HOOP_X, y: RIM_Y };
    const backRim = { x: HOOP_X + HOOP_DIAMETER, y: RIM_Y };

    const distToFrontRim = Math.hypot(newPos.x - frontRim.x, newPos.y - frontRim.y);
    const distToBackRim = Math.hypot(newPos.x - backRim.x, newPos.y - backRim.y);

    if (distToFrontRim < BALL_RADIUS || distToBackRim < BALL_RADIUS) {
        newVel.y *= -BOUNCE_DAMPING;
    }

    // Scoring
    if (
      !hasScoredRef.current &&
      prevBallPositionRef.current.y < RIM_Y &&
      newPos.y >= RIM_Y &&
      newPos.x > HOOP_X &&
      newPos.x < HOOP_X + HOOP_DIAMETER
    ) {
      hasScoredRef.current = true;
      setScore((s) => s + 1);
      setShotResult('scored');
    }
    
    setBallPosition(newPos);
    ballVelocityRef.current = newVel;
    
    // End of shot when ball is resting on the ground
    const totalVelocity = Math.hypot(newVel.x, newVel.y);
    const isOnGround = newPos.y + BALL_RADIUS >= COURT_HEIGHT - 1; // Tolerance for floating point

    if (gameStatus === GameStatus.InFlight && isOnGround && totalVelocity < 1) {
      setGameStatus(GameStatus.Result);
      if (!hasScoredRef.current) {
        setShotResult('missed');
      }
      setTimeout(resetShot, 1500);
      return;
    }

    animationFrameId.current = requestAnimationFrame(gameLoop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballPosition, resetShot, gameStatus]);


  useEffect(() => {
    if (gameStatus === GameStatus.InFlight) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameStatus, gameLoop]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h1 className="text-4xl font-bold text-white mb-4">React Basketball</h1>
      <GameCourt
        ballPosition={ballPosition}
        angle={angle}
        power={power}
        gameStatus={gameStatus}
        score={score}
        attempts={attempts}
        shotResult={shotResult}
      />
      <Controls
        angle={angle}
        power={power}
        onAngleChange={setAngle}
        onPowerChange={setPower}
        onShoot={handleShoot}
        onReset={handleResetGame}
        disabled={gameStatus !== GameStatus.Aiming}
      />
    </main>
  );
}

export default App;