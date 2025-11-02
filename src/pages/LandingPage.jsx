import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import "@/App.css";

export default function LandingPage({ onShowAuth }) {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <CalendarIcon className="logo-icon" />
            <span>TimeAlign</span>
          </div>
          <Button onClick={onShowAuth} variant="outline">Sign In</Button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find the Perfect Time for Your Study Group</h1>
          <p className="hero-subtitle">
            Stop the endless back-and-forth. TimeAlign automatically finds when
            everyone's available and creates calendar events in seconds.
          </p>
          <Button onClick={onShowAuth} size="lg" className="cta-button">
            Get Started Free
          </Button>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2025 TimeAlign. Making group scheduling effortless.</p>
      </footer>
    </div>
  );
}