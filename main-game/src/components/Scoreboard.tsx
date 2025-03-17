import buildingsData from "../data/buildings.json";

interface ScoreboardProps {
    correctBuildings: string[];
  }
  
  export default function Scoreboard({ correctBuildings }: ScoreboardProps) {
    const totalBuildings = buildingsData.length; // Update this with your total number of buildings
    const percentage = ((correctBuildings.length / totalBuildings) * 100).toFixed(2);
  
    return (
      <div className="mb-6">
        <p className="text-xl font-['Poppins'] font-bold">
          {correctBuildings.length} buildings found 
          <span className="text-black-600 ml-2">({percentage}%)</span>
        </p>
      </div>
    );
  }

  