import { AuthProvider } from "./context/AuthContext";
import Game from "./pages/Game";

export default function App() {
  return (
    <AuthProvider>
      <Game />
    </AuthProvider>
  );
}