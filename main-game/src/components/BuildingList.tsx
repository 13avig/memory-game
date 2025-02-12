interface BuildingListProps {
    correctBuildings: string[];
  }
  
  export default function BuildingList({ correctBuildings }: BuildingListProps) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-lg font-bold">Buildings Found:</h2>
        <ul>
          {correctBuildings.map((name, index) => (
            <li key={index} className="text-green-600 font-semibold">
              {name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  