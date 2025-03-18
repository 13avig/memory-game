interface CoverScreenProps {
  onDismiss: () => void;
}

export default function CoverScreen({ onDismiss }: CoverScreenProps) {
  return (
    <div 
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer transition-opacity duration-500"
      onClick={onDismiss}
    >
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold font-['Poppins'] mb-4">Welcome to Berkeley Memory</h1>
        <p className="text-xl font-['Poppins']">Type building names and press enter. Sign in to save your progress.</p>
        <p className="text-lg mt-4 font-['Poppins'] opacity-75">Click anywhere to start. Inspired by <a href="https://www.youtube.com/watch?v=BT44fEUWego" target="_blank" rel="noopener noreferrer" className="text-white-400 hover:text-blue-600 underline">London Metro Memory Game</a></p> 
      </div>
    </div>
  );
} 