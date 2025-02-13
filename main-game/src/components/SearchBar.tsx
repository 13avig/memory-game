import { useState } from "react";

interface SearchBarProps {
  onGuess: (buildingName: string) => boolean;
  className?: string;
}

export default function SearchBar({ onGuess, className }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [correctBuildings, setCorrectBuildings] = useState<string[]>([]);

  // Add reset game handler
  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      setCorrectBuildings([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      const wasCorrect = onGuess(value);
      if (!wasCorrect) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300); // Reset shake after animation
      }
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        `}
      </style>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Building"
        className={`flex-grow px-4 py-3 rounded-full shadow-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Poppins'] ${
          isShaking ? 'shake' : ''
        }`}
      />
      <button 
        type="button"
        onClick={handleReset}
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
