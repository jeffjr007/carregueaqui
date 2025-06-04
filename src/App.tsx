import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import LoadingScreen from "./components/LoadingScreen";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Map from "./components/Map";
import AdminPanel from "./components/admin/AdminPanel";
import NotFound from "./pages/NotFound";
import Terms from "@/pages/Terms";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import AboutApp from "@/pages/AboutApp";
import { IntroductionScreen } from "./components/IntroductionScreen";
import { ProjectDetails } from "./components/ProjectDetails";

// Import i18n
import './i18n';

// Import Sentry
import * as Sentry from "@sentry/react";

// Inicialize o Sentry (desative durante desenvolvimento)
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN", // Substitua pelo seu DSN do Sentry
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    // Definir uma % de transações para rastreamento para monitoramento de desempenho
    tracesSampleRate: 1.0,
    // Definir uma % de sessões para monitoramento de replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const queryClient = new QueryClient();

// Componente App com Sentry ErrorBoundary
const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showIntroduction, setShowIntroduction] = useState(true);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        setShowIntroduction(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleIntroductionComplete = () => {
    setShowIntroduction(false);
  };

  const handleShowDetails = () => {
    setShowProjectDetails(true);
  };

  const handleCloseDetails = () => {
    setShowProjectDetails(false);
  };

  return (
    <Sentry.ErrorBoundary fallback={<p>Um erro ocorreu. Nossa equipe foi notificada.</p>}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {loading ? (
              <LoadingScreen />
            ) : (
              <>
                {showIntroduction && !session && (
                  <IntroductionScreen onComplete={handleIntroductionComplete} />
                )}
                {showProjectDetails && (
                  <ProjectDetails
                    onClose={handleCloseDetails}
                    githubUrl="https://github.com/jeffjr007"
                    linkedinUrl="https://www.linkedin.com/in/jeferson-junior-as"
                    email="jeffjr007z@gmail.com"
                  />
                )}
                <Routes>
                  <Route
                    path="/"
                    element={
                      session ? (
                        <Navigate to="/map" replace />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      session ? <Navigate to="/map" replace /> : <LoginForm onShowDetails={handleShowDetails} />
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      session ? <Navigate to="/map" replace /> : <RegisterForm />
                    }
                  />
                  <Route
                    path="/map"
                    element={
                      session ? <Map /> : <Navigate to="/login" replace />
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      session ? <AdminPanel /> : <Navigate to="/login" replace />
                    }
                  />
                  <Route path="/termos" element={<Terms />} />
                  <Route path="/privacidade" element={<PrivacyPolicy />} />
                  <Route path="/sobre" element={<AboutApp />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Sentry.ErrorBoundary>
  );
};

export default Sentry.withProfiler(App);
