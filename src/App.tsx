import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import RankingPage from "./pages/RankingPage.tsx";
import CheckInsPage from "./pages/CheckInsPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import CommunityPage from "./pages/CommunityPage.tsx";
import StudentView360Page from "./pages/StudentView360Page.tsx";
import ChampionshipsPage from "./pages/ChampionshipsPage.tsx";
import ChallengesPage from "./pages/ChallengesPage.tsx";
import GradePage from "./pages/GradePage.tsx";
import StudentRegistrationPage from "./pages/StudentRegistrationPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/check-ins" element={<CheckInsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/comunidade" element={<CommunityPage />} />
          <Route path="/visao-360" element={<StudentView360Page />} />
          <Route path="/campeonatos" element={<ChampionshipsPage />} />
          <Route path="/grade" element={<GradePage />} />
          <Route path="/cadastro" element={<StudentRegistrationPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
