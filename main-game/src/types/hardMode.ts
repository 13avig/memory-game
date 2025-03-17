export interface BuildingGuess {
  buildingName: string;
  guessLocation: [number, number]; // [longitude, latitude]
  actualLocation: [number, number];
}

export interface HardModeState {
  currentBuildingIndex: number;
  guesses: BuildingGuess[];
  isComplete: boolean;
  score: number | null;
} 