import { useState } from "react";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import ReadingTool from "@/components/ReadingTool";
import MathTool from "@/components/MathTool";
import WritingTool from "@/components/WritingTool";
import AssessmentModule from "@/components/AssessmentModule";
import ResultsAnalysis from "@/components/ResultsAnalysis";
import PersonalizedTasks from "@/components/PersonalizedTasks";

interface AssessmentResult {
  testName: string;
  score: number;
  maxScore: number;
  difficulty: 'low' | 'medium' | 'high';
  timeSpent: number;
  errors: string[];
}

interface LearningProfile {
  overallLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  challenges: string[];
  recommendedTasks: any[];
  focusAreas: string[];
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'reading' | 'math' | 'writing' | 'assessment' | 'learning'>('home');
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleNavigation = (page: 'home' | 'reading' | 'math' | 'writing' | 'assessment' | 'learning') => {
    setCurrentPage(page);
  };

  const handleAssessmentComplete = (results: AssessmentResult[]) => {
    setAssessmentResults(results);
    setShowResults(true);
  };

  const handleStartLearning = (profile: LearningProfile) => {
    setLearningProfile(profile);
    setShowResults(false);
    setCurrentPage('learning');
  };

  const renderCurrentPage = () => {
    if (currentPage === 'assessment' && showResults) {
      return (
        <ResultsAnalysis 
          results={assessmentResults}
          onStartLearning={handleStartLearning}
        />
      );
    }

    switch (currentPage) {
      case 'reading':
        return <ReadingTool />;
      case 'math':
        return <MathTool />;
      case 'writing':
        return <WritingTool />;
      case 'assessment':
        return <AssessmentModule onComplete={handleAssessmentComplete} />;
      case 'learning':
        return learningProfile ? (
          <PersonalizedTasks learningProfile={learningProfile} />
        ) : (
          <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Complete Assessment First</h2>
            <p className="text-muted-foreground mb-6">
              Take our comprehensive assessment to unlock your personalized learning journey.
            </p>
            <button 
              onClick={() => setCurrentPage('assessment')}
              className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg"
            >
              Start Assessment
            </button>
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-accessible">
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
