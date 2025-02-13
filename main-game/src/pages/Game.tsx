import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import Scoreboard from "../components/Scoreboard";
import BuildingList from "../components/BuildingList";
import buildingsData from "../data/buildings.json"; // Import buildings list

// Add this helper function to calculate Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
}

export default function Game() {
  const [correctBuildings, setCorrectBuildings] = useState<string[]>([]);
  const buildings = buildingsData.map((b) => b.name.toLowerCase()); // Store names in lowercase for validation

  // Add reset game handler
  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      setCorrectBuildings([]);
    }
  };

  type BuildingAliases = {
    [key: string]: string[];
  };
  
  // Add this constant with acceptable alternative names
  const buildingAliases: BuildingAliases = {
    "Wheeler Hall": ["wheeler"],
    "Doe Memorial Library": ["doe", "doe library"],
    "Campanile (Sather Tower)": ["campanile", "sather tower"],
    "Moffitt Undergraduate Library": ["moffitt"],
    "Soda Hall": ["soda"],
    "Dwinelle Hall": ["dwinelle"],
    "Valley Life Sciences Building": ["vlsb"], // only if you want to allow the common acronym
    // ... add more aliases as needed
  };

  const handleGuess = (buildingName: string) => {
    const formattedGuess = buildingName.trim().toLowerCase();
    
    // Find building that matches either full name, alias, or is similar enough
    const matchedBuilding = buildingsData.find(building => {
      const fullName = building.name.toLowerCase();
      
      // Exact match
      if (fullName === formattedGuess) return true;
      
      // Check aliases
      const aliases = buildingAliases[building.name] || [];
      if (aliases.includes(formattedGuess)) return true;
      
      // For longer building names (>6 chars), check for similarity
      if (formattedGuess.length > 6) {
        // Calculate similarity threshold based on length
        const maxDistance = Math.floor(formattedGuess.length / 5); // allows roughly 1 error per 5 characters
        
        // Check similarity with full name
        if (levenshteinDistance(fullName, formattedGuess) <= maxDistance) {
          return true;
        }
        
        // Check similarity with aliases
        return aliases.some(alias => 
          levenshteinDistance(alias, formattedGuess) <= maxDistance
        );
      }

      return false;
    });

    if (matchedBuilding && !correctBuildings.includes(matchedBuilding.name)) {
      setCorrectBuildings(prev => [...prev, matchedBuilding.name]);
      return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Search bar container */}
      <div className="absolute top-4 left-0 right-0 flex justify-center items-center z-20">
        <div className="flex items-center gap-2 max-w-xl w-[90%] sm:w-[60%]">
          <SearchBar onGuess={handleGuess} className="flex-grow" />
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative">
        <Map correctBuildings={correctBuildings} />
      </div>

      {/* Scoreboard container */}
      <div className="w-full lg:w-1/3 p-8 bg-white shadow-lg z-10 overflow-y-auto">
        <Scoreboard correctBuildings={correctBuildings} />
        <div className="h-[40vh]"></div>
        <BuildingList correctBuildings={correctBuildings} />
      </div>
    </div>
  );
}


