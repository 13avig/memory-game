import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Game from "./pages/Game";
import HardMode from "./pages/HardMode";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/hard" element={<HardMode />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}