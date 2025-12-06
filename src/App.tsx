import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { AIChat } from "@/components/AIChat";
import Index from "./pages/Index";
import Tracks from "./pages/TracksNew";
import TrackDetail from "./pages/TrackDetailNew";
import Projects from "./pages/Projects";
import Auth from "./pages/Auth";
import DashboardNew from "./pages/DashboardNew";
import Quiz from "./pages/Quiz";
import QuizResults from "./pages/QuizResults";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Set dark mode as default
function DarkModeInitializer() {
  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DarkModeInitializer />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardNew />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/track/:id" element={<TrackDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/quiz/:id/results/:attemptId" element={<QuizResults />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChat />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
