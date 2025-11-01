import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import AuthModal from "@/components/AuthModal";
import "@/App.css";

function AppShell() {
  const [showAuth, setShowAuth] = useState(false);
  const { user, login, logout, loading } = useAuth();

  return (
    <div className="App">
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loading ? (
                <div className="loading-screen">Loading...</div>
              ) : user ? (
                <Navigate to="/dashboard" />
              ) : (
                <LandingPage onShowAuth={() => setShowAuth(true)} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>

      <AuthModal open={showAuth && !user} onClose={() => setShowAuth(false)} onLogin={login} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {(ctx) => <AppShell key={String(!!ctx.user)} />}
    </AuthProvider>
  );
}