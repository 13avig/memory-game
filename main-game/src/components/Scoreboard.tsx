import buildingsData from "../data/buildings.json";

interface ScoreboardProps {
    correctBuildings: string[];
  }
  
  export default function Scoreboard({ correctBuildings }: ScoreboardProps) {
    const totalBuildings = 60; // Update this with your total number of buildings
    const percentage = ((correctBuildings.length / totalBuildings) * 100).toFixed(2);
  
    return (
      <div className="mb-6">
        <p className="text-4xl font-bold font-['Poppins'] mb-2">
          {percentage}% <span className="text-xl text-black-600 font-['Poppins'] mt-1">buildings found</span>
        </p>
      </div>
    );
  }

  