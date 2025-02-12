import { useState } from "react";

interface SearchBarProps {
  onGuess: (buildingName: string) => void;
}

export default function SearchBar({ onGuess }: SearchBarProps) {
  const [input, setInput] = useState("");

  const handleGuess = () => {
    if (input.trim()) {
      onGuess(input);
      setInput(""); // Clear input after guessing
    }
  };

  return (
    <div className="mb-4 flex">
      <input
        type="text"
        placeholder="Type a building name..."
        className="w-full p-2 border rounded-l-lg"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="px-4 bg-blue-600 text-white rounded-r-lg"
        onClick={handleGuess}
      >
        Guess
      </button>
    </div>
  );
}
