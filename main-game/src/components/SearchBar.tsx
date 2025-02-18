import { useState } from "react";

interface SearchBarProps {
  onGuess: (buildingName: string) => boolean;
  onReset: () => void;
  correctBuildings: string[];
  className?: string;
}

function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }
  return track[str2.length][str1.length];
}

export default function SearchBar({ onGuess, onReset, correctBuildings }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showAlreadyFound, setShowAlreadyFound] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      const normalizedGuess = value.trim().toLowerCase();
      
      // More lenient fuzzy matching for already found buildings
      const isAlreadyFound = correctBuildings.some(building => {
        const normalizedBuilding = building.toLowerCase();
        
        // Check for exact match first
        if (normalizedBuilding === normalizedGuess) {
          return true;
        }

        // For fuzzy matching, calculate similarity ratio
        const maxLength = Math.max(normalizedGuess.length, normalizedBuilding.length);
        const distance = levenshteinDistance(normalizedGuess, normalizedBuilding);
        const similarity = (maxLength - distance) / maxLength;

        // Adjust these thresholds as needed
        return (
          normalizedGuess.length >= 3 && 
          (
            // Higher similarity threshold for shorter strings
            (normalizedGuess.length <= 5 && similarity >= 0.7) ||
            // Lower similarity threshold for longer strings
            (normalizedGuess.length > 5 && similarity >= 0.6)
          )
        );
      });

      if (isAlreadyFound) {
        setShowAlreadyFound(true);
        setTimeout(() => setShowAlreadyFound(false), 2000);
        setValue('');
        return;
      }

      const wasCorrect = onGuess(value);
      if (!wasCorrect) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
      } else {
        setValue('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-4px); }
            40% { transform: translateX(4px); }
            60% { transform: translateX(-2px); }
            80% { transform: translateX(2px); }
            100% { transform: translateX(0); }
          }
          .shake {
            animation: shake 0.3s ease-in-out;
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .fade-out {
            animation: fadeOut 2s ease-in-out;
          }
        `}
      </style>
      <div className="relative flex-grow">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Building"
          className={`w-full px-4 py-3 rounded-full shadow-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Poppins'] ${
            isShaking ? 'shake' : ''
          }`}
        />
        {showAlreadyFound && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-xs font-['Poppins'] fade-out">
            ALREADY FOUND
          </div>
        )}
      </div>
      <button 
        type="button"
        onClick={onReset}
        className="ml-2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        title="Reset Game"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      </button>
    </form>
  );
}
