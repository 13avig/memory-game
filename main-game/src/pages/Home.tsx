import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <Link to="/game">
        <button className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700">
          Start Game
        </button>
      </Link>
    </div>
  );
}