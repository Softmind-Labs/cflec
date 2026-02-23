import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Modules from "./pages/Modules";
import ModulePlayer from "./pages/ModulePlayer";
import Simulator from "./pages/Simulator";
import SimulatorBanking from "./pages/simulator/SimulatorBanking";
import SimulatorInvestment from "./pages/simulator/SimulatorInvestment";
import SimulatorTrading from "./pages/simulator/SimulatorTrading";
import SimulatorCapitalMarkets from "./pages/simulator/SimulatorCapitalMarkets";
import Trade from "./pages/Trade";
import Leaderboard from "./pages/Leaderboard";
import Certificates from "./pages/Certificates";
import Profile from "./pages/Profile";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import KidsLanding from "./pages/kids/KidsLanding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/kids" element={<KidsLanding />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/modules" element={
              <ProtectedRoute>
                <Modules />
              </ProtectedRoute>
            } />
            <Route path="/modules/:id" element={
              <ProtectedRoute>
                <ModulePlayer />
              </ProtectedRoute>
            } />
            <Route path="/simulator" element={
              <ProtectedRoute>
                <Simulator />
              </ProtectedRoute>
            } />
            <Route path="/simulator/banking" element={
              <ProtectedRoute>
                <SimulatorBanking />
              </ProtectedRoute>
            } />
            <Route path="/simulator/investment" element={
              <ProtectedRoute>
                <SimulatorInvestment />
              </ProtectedRoute>
            } />
            <Route path="/simulator/trading" element={
              <ProtectedRoute>
                <SimulatorTrading />
              </ProtectedRoute>
            } />
            <Route path="/simulator/capital-markets" element={
              <ProtectedRoute>
                <SimulatorCapitalMarkets />
              </ProtectedRoute>
            } />
            <Route path="/simulator/trade" element={
              <ProtectedRoute>
                <Trade />
              </ProtectedRoute>
            } />
            <Route path="/simulator/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/courses/:slug" element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
