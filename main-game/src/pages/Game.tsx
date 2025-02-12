import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import Scoreboard from "../components/Scoreboard";
import BuildingList from "../components/BuildingList";
import buildingsData from "../data/buildings.json"; // Import buildings list

export default function Game() {
  const [correctBuildings, setCorrectBuildings] = useState<string[]>([]);
  const buildings = buildingsData.map((b) => b.name.toLowerCase()); // Store names in lowercase for validation

  const handleGuess = (buildingName: string) => {
    const formattedName = buildingName.trim().toLowerCase(); // Normalize user input

    // Check if the building exists in the dataset and hasn't been guessed before
    if (buildings.includes(formattedName) && !correctBuildings.includes(formattedName)) {
      setCorrectBuildings((prev) => [...prev, formattedName]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex-1">
        <Map correctBuildings={correctBuildings} />
      </div>

      <div className="w-full lg:w-1/3 p-4 bg-white shadow-lg">
        <SearchBar onGuess={handleGuess} />
        <Scoreboard correctBuildings={correctBuildings} />
        <BuildingList correctBuildings={correctBuildings} />
      </div>
    </div>
  );
}
