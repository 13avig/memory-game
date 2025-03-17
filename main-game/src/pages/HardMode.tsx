import { useState } from 'react';
import { Link } from 'react-router-dom';
import HardModeMap from "../components/HardModeMap";
import buildingsData from '../data/buildings.json';
import { BuildingGuess, HardModeState } from '../types/hardMode';

const BERKELEY_CAMPUS_RADIUS = 800; // meters
//const BERKELEY_CENTER: [number, number] = [-122.259, 37.872]; // Berkeley campus center coordinates

export default function HardMode() {
  const [gameState, setGameState] = useState<HardModeState>({
    currentBuildingIndex: 0,
    guesses: [],
    isComplete: false,
    score: null
  });

  const [shuffledBuildings] = useState(() => 
    [...buildingsData].sort(() => Math.random() - 0.5)
  );

  const handleMapClick = (coordinates: [number, number]) => {
    if (gameState.isComplete) return;

    const currentBuilding = shuffledBuildings[gameState.currentBuildingIndex];
    
    setGameState(prev => {
      const newGuesses = [...prev.guesses];
      newGuesses[prev.currentBuildingIndex] = {
        buildingName: currentBuilding.name,
        guessLocation: coordinates,
        actualLocation: [Number(currentBuilding.longitude), Number(currentBuilding.latitude)]
      };

      const isLastBuilding = prev.currentBuildingIndex === shuffledBuildings.length - 1;
      
      if (isLastBuilding) {
        const totalScore = calculateFinalScore(newGuesses);
        return {
          ...prev,
          guesses: newGuesses,
          isComplete: true,
          score: totalScore
        };
      }

      return {
        ...prev,
        guesses: newGuesses,
        currentBuildingIndex: prev.currentBuildingIndex + 1
      };
    });
  };

  const handlePrevious = () => {
    if (gameState.currentBuildingIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentBuildingIndex: prev.currentBuildingIndex - 1
      }));
    }
  };

  const handleNext = () => {
    if (gameState.currentBuildingIndex < gameState.guesses.length) {
      setGameState(prev => ({
        ...prev,
        currentBuildingIndex: prev.currentBuildingIndex + 1
      }));
    }
  };

  const calculateFinalScore = (guesses: BuildingGuess[]): number => {
    return guesses.reduce((total, guess) => {
      const distance = calculateDistance(
        guess.guessLocation,
        guess.actualLocation
      );
      return total + Math.min(distance, BERKELEY_CAMPUS_RADIUS);
    }, 0);
  };

  const calculateDistance = (
    point1: [number, number],
    point2: [number, number]
  ): number => {
    // Haversine formula implementation
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1[1] * Math.PI/180;
    const φ2 = point2[1] * Math.PI/180;
    const Δφ = (point2[1]-point1[1]) * Math.PI/180;
    const Δλ = (point2[0]-point1[0]) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Normal Mode
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold">
              {gameState.isComplete 
                ? "Game Complete!" 
                : `Find ${shuffledBuildings[gameState.currentBuildingIndex]?.name}`}
            </h1>
            {gameState.isComplete && (
              <p className="text-lg">
                Final Score: {Math.round(gameState.score!)} meters
              </p>
            )}
          </div>
          <div className="w-20">
            {/* Spacer for flex alignment */}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <HardModeMap
          onMapClick={handleMapClick}
          guesses={gameState.guesses}
          showCorrectLocations={gameState.isComplete}
          currentBuildingIndex={gameState.currentBuildingIndex}
        />
      </div>

      {/* Navigation Controls */}
      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={gameState.currentBuildingIndex === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Previous
          </button>
          <div className="text-center">
            {gameState.currentBuildingIndex + 1} / {shuffledBuildings.length}
          </div>
          <button
            onClick={handleNext}
            disabled={gameState.currentBuildingIndex >= gameState.guesses.length}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 