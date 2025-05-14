
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { TimerProvider } from "./context/TimerContext";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PasswordManager from "./pages/PasswordManager";
import Notes from "./pages/Notes";
import Links from "./pages/Links";
import Prompts from "./pages/Prompts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";
import AILinks from "./pages/AiLinks";
import PomodoroTimer from "./pages/PomodoroTimer";
import CodeSnippets from "./pages/CodeSnippets";
import BugLog from "./pages/BugLog";
import DailyGoals from "./pages/DailyGoals";
import Skills from "./pages/Skills";
import { ColorConverter } from "./pages/ColorConverter";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth guard component
  const PrivateRoute = ({ children }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>;
    return session ? children : <Navigate to="/auth" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="secure-vault-theme">
        <TimerProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<Auth />} />
                <Route element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/passwords" element={<PasswordManager />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/links" element={<Links />} />
                  <Route path="/prompts" element={<Prompts />} />
                  <Route path="/ai-links" element={<AILinks />} />
                  <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
                  <Route path="/code" element={<CodeSnippets />} />
                  <Route path="/bugs" element={<BugLog />} />
                  <Route path="/goals" element={<DailyGoals />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/dev-tools/color-converter" element={<ColorConverter />} />
                </Route>
                <Route
                  path="/pomodoro-timer/stopwatch"
                  element={
                    <PrivateRoute>
                      <PomodoroTimer initialTab="stopwatch" />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TimerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
