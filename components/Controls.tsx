import React from 'react';

interface ControlsProps {
  angle: number;
  power: number;
  onAngleChange: (value: number) => void;
  onPowerChange: (value: number) => void;
  onShoot: () => void;
  onReset: () => void;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  angle,
  power,
  onAngleChange,
  onPowerChange,
  onShoot,
  onReset,
  disabled,
}) => {
  return (
    <div className="w-full max-w-lg mt-8 p-6 bg-gray-800 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-sm text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="angle" className="block mb-2 font-bold text-lg">
            Angle: {angle}°
          </label>
          <input
            id="angle"
            type="range"
            min="0"
            max="90"
            value={angle}
            onChange={(e) => onAngleChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500 disabled:opacity-50"
          />
        </div>
        <div>
          <label htmlFor="power" className="block mb-2 font-bold text-lg">
            Power: {power}
          </label>
          <input
            id="power"
            type="range"
            min="0"
            max="100"
            value={power}
            onChange={(e) => onPowerChange(Number(e.target.value))}
            disabled={disabled}
            className="w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer range-lg accent-pink-500 disabled:opacity-50"
          />
        </div>
      </div>
      <div className="flex w-full items-center gap-4">
        <button
          onClick={onShoot}
          disabled={disabled}
          className="flex-1 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
        >
          SHOOT
        </button>
         <button
          onClick={onReset}
          className="py-4 px-6 text-lg font-bold text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          aria-label="Reset ball position"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Controls;