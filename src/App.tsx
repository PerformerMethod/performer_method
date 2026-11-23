import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { TabBar } from "./components/TabBar";
import { AuthProvider } from "./hooks/useAuth";
import { Community } from "./pages/Community";
import { ForYou } from "./pages/ForYou";
import { Home } from "./pages/Home";
import { Join } from "./pages/Join";
import { Legal } from "./pages/Legal";
import { Lifecycle } from "./pages/Lifecycle";
import { Me } from "./pages/Me";
import { Method } from "./pages/Method";
import { Pass } from "./pages/Pass";
import { Practitioners } from "./pages/Practitioners";
import { Recovery } from "./pages/Recovery";

function AppRoutes() {
  const location = useLocation();

  return (
    <div className="app-shell" key={location.pathname}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practitioners" element={<Practitioners />} />
        <Route path="/method" element={<Method />} />
        <Route path="/method/:pillarId" element={<Method />} />
        <Route path="/lifecycle" element={<Lifecycle />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/pass" element={<Pass />} />
        <Route path="/community" element={<Community />} />
        <Route path="/join" element={<Join />} />
        <Route path="/me" element={<Me />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <TabBar />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
