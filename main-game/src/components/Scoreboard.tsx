import buildingsData from "../data/buildings.json";

interface ScoreboardProps {
    correctBuildings: string[];
  }
  
  export default function Scoreboard({ correctBuildings }: ScoreboardProps) {
    console.log(buildingsData);
    const totalBuildings = buildingsData.length; // Adjust based on total dataset
    const progress = (correctBuildings.length / totalBuildings) * 100;
  
    return (
      <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-bold">Progress: {progress.toFixed(2)}%</h2>
      </div>
    );
  }

  