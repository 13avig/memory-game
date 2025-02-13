interface BuildingListProps {
    correctBuildings: string[];
  }
  
  export default function BuildingList({ correctBuildings }: BuildingListProps) {
    return (
      <div>
        <h2 className="text-2xl font-['Poppins'] font-bold mb-4 mt-38">
          {correctBuildings.length} BUILDINGS
        </h2>
        <div className="space-y-3">
          {correctBuildings.map((building, index) => (
            <div key={index} className="flex items-center">
              <span className="font-['Poppins'] text-sm">{building}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  