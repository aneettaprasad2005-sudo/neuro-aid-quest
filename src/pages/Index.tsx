import { useState } from "react";
import Header from "@/components/Header";
import HomePage from "@/components/HomePage";
import ReadingTool from "@/components/ReadingTool";
import MathTool from "@/components/MathTool";
import WritingTool from "@/components/WritingTool";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'reading' | 'math' | 'writing'>('home');

  const handleNavigation = (page: 'home' | 'reading' | 'math' | 'writing') => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'reading':
        return <ReadingTool />;
      case 'math':
        return <MathTool />;
      case 'writing':
        return <WritingTool />;
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
