import { useState } from "react";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import DistractionDetector from "@/components/DistractionDetector";
import Analytics from "@/components/Analytics";
import Settings from "@/components/Settings";

export interface DistractionEvent {
  timestamp: number;
  type: 'looking_away' | 'phone_detected' | 'multiple_faces' | 'no_face' | 'eyes_closed';
  confidence: number;
  duration: number;
}

export interface SessionData {
  sessionId: string;
  startTime: number;
  endTime?: number;
  distractions: DistractionEvent[];
  focusScore: number;
  totalDuration: number;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'detector' | 'analytics' | 'settings'>('home');
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);

  const handleNavigation = (page: 'home' | 'detector' | 'analytics' | 'settings') => {
    setCurrentPage(page);
  };

  const handleSessionStart = (session: SessionData) => {
    setCurrentSession(session);
  };

  const handleSessionEnd = (session: SessionData) => {
    setSessions(prev => [...prev, session]);
    setCurrentSession(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'detector':
        return (
          <DistractionDetector 
            onSessionStart={handleSessionStart}
            onSessionEnd={handleSessionEnd}
            currentSession={currentSession}
          />
        );
      case 'analytics':
        return <Analytics sessions={sessions} />;
      case 'settings':
        return <Settings />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentPage={currentPage} 
        onPageChange={handleNavigation} 
      />
      <main className="pb-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
