import { useEffect, useState } from "react";

interface BuildingListProps {
    correctBuildings: string[];
  }
  
  export default function BuildingList({ correctBuildings }: BuildingListProps) {
    const [animatedList, setAnimatedList] = useState<string[]>([]);
  
    useEffect(() => {
      if (correctBuildings.length > animatedList.length) {
        // New building was added
        setAnimatedList([correctBuildings[correctBuildings.length - 1], ...animatedList]);
      } else if (correctBuildings.length < animatedList.length) {
        // Reset occurred
        setAnimatedList([]);
      }
    }, [correctBuildings]);
  
    return (
      <div>
        <div className="space-y-3">
          {animatedList.map((building, index) => (
            <div
              key={building}
              className="flex items-center transform transition-all duration-300 animate-slideDown"
              style={{
                opacity: 0,
                animation: 'slideDown 0.3s ease forwards',
                animationDelay: `${index * 0.05}s`
              }}
            >
              <span className="font-['Poppins'] text-sm">{building}</span>
            </div>
          ))}
        </div>
        <style>
          {`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  }
  