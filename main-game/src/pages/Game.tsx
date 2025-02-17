import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import Scoreboard from "../components/Scoreboard";
import BuildingList from "../components/BuildingList";
import buildingsData from "../data/buildings.json"; // Import buildings list
import CoverScreen from "../components/CoverScreen";

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
  const [showCover, setShowCover] = useState(true);
  const [correctBuildings, setCorrectBuildings] = useState<string[]>([]);
  //const buildings = buildingsData.map((b) => b.name.toLowerCase()); // Store names in lowercase for validation

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
    "Anthony Hall": ["anthony"],
    "Barker Hall": ["barker"],
    "Social Sciences Building": ["barrows", "social sciences", "socs"],
    "Bechtel Engineering Center": ["bechtel", "engineering", "engineering center"],
    "Birge Hall": ["birge"],
    "Blum Hall": ["blum", "blum center"],
    "School of Law": ["boalt", "school of law"],
    "California Hall": ["california"],
    "Campbell Hall": ["campbell"],
    "Cheit Hall": ["cheit"],
    "Chou Hall": ["chou"],
    "Cory Hall": ["cory"],
    "Davis Hall": ["davis"],
    "Durant Hall": ["durant"],
    "Dwinelle Hall": ["dwinelle"],
    "Eshleman Hall": ["eshleman"],
    "Etcheverry Hall": ["etcheverry"],
    "Evans Hall": ["evans"],
    "Genetics and Plant Biology Building": ["genetics", "plant biology", "genetics and plant biology"],
    "Giannini Hall": ["giannini"],
    "Giauque Hall": ["giauque"],
    "Gilman Hall": ["gilman"],
    "Haviland Hall": ["haviland"],
    "Hearst Field Annex": ["hearst", "hearst annex", "hearst field"],
    "Hearst Memorial": ["hearst mining", "hearst memorial", "hearst memorial mining"],
    "Hertz Hall": ["hertz"],
    "Hesse Hall": ["hesse"],
    "Hildebrand Hall": ["hildebrand"],
    "Hilgard Hall": ["hilgard"],
    "Jacobs Hall": ["jacobs"],
    "Koshland Hall": ["koshland"],
    "Anthropology and Art Practice Building": ["kroeber", "anthropology", "art practice", "anthropology and art practice"],
    "Latimer Hall": ["latimer"],
    "Physics Building": ["leconte", "physics north", "physics south", "physics"],
    "Lewis Hall": ["lewis"],
    "Li Ka Shing Center": ["li ka shing"],
    "McCone Hall": ["mccone"],
    "McLaughlin Hall": ["mclaughlin"],
    "Minor Hall": ["minor"],
    "Morgan Hall": ["morgan"],
    "Morrison Hall": ["morrison"],
    "Philosophy Hall": ["moses", "philosophy"],
    "Mulford Hall": ["mulford"],
    "North Gate Hall": ["north gate"],
    "O'Brien Hall": ["o'brien"],
    "Pimentel Hall": ["pimentel"],
    "Goldman School of Public Policy": ["goldman", "public policy"],
    "Simon Hall": ["simon"],
    "Soda Hall": ["soda"],
    "South Hall": ["south"],
    "Sproul Hall": ["sproul"],
    "Stanley Hall": ["stanley"],
    "Stephens Hall": ["stephens"],
    "Sutardja Dai Hall": ["sutardja dai", "CITRIS"],
    "Tan Hall": ["tan"],
    "Valley Life Sciences Building": ["life sciences", "vlsb"],
    "Warren Hall": ["warren"],
    "Wellman Hall": ["wellman"],
    "Wheeler Hall": ["wheeler"],
    "Wurster Hall": ["wurster"],
    "Zellerbach Hall": ["zellerbach"]
  };

  const handleGuess = (buildingName: string) => {
    const formattedGuess = buildingName.trim().toLowerCase();
    
    // Find building that matches either full name, alias, or is similar enough
    const matchedBuilding = buildingsData.find(building => {
      const fullName = building.name.toLowerCase();
      
      // Exact match
      if (fullName === formattedGuess) return true;
      
      // Check aliases - look through all alias lists
      for (const [buildingKey, aliases] of Object.entries(buildingAliases)) {
        if (building.name.includes(buildingKey) && aliases.includes(formattedGuess)) {
          return true;
        }
      }
      
      // For longer building names (>6 chars), check for similarity
      if (formattedGuess.length > 6) {
        const maxDistance = Math.floor(formattedGuess.length / 5);
        
        if (levenshteinDistance(fullName, formattedGuess) <= maxDistance) {
          return true;
        }
        
        // Check similarity with all possible aliases
        for (const [buildingKey, aliases] of Object.entries(buildingAliases)) {
          if (building.name.includes(buildingKey)) {
            if (aliases.some(alias => levenshteinDistance(alias, formattedGuess) <= maxDistance)) {
              return true;
            }
          }
        }
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
      {showCover && <CoverScreen onDismiss={() => setShowCover(false)} />}
      
      {/* Search bar container */}
      <div className="absolute top-4 left-0 right-0 flex justify-center items-center z-20">
        <div className="flex items-center gap-2 max-w-xl w-[90%] sm:w-[60%]">
          <SearchBar 
            onGuess={handleGuess} 
            onReset={handleReset}
            className="flex-grow" 
          />
        </div>
      </div>

      {/* Map container */}
      <div className="flex-1 relative">
        <Map correctBuildings={correctBuildings} />
      </div>

      {/* Scoreboard container */}
      <div className="w-full lg:w-1/3 p-8 bg-white shadow-lg z-10 overflow-y-auto">
        <Scoreboard correctBuildings={correctBuildings} />
        {/* <div className="h-[40vh]"></div> */}
        <BuildingList correctBuildings={correctBuildings} />
      </div>
    </div>
  );
}


