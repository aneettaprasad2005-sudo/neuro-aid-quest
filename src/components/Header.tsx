import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calculator, 
  Settings, 
  Contrast, 
  Type,
  Heart,
  PenTool 
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentPage: 'home' | 'reading' | 'math' | 'writing';
  onPageChange: (page: 'home' | 'reading' | 'math' | 'writing') => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(true);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const toggleDyslexiaFont = () => {
    setDyslexiaFont(!dyslexiaFont);
    document.body.classList.toggle('font-dyslexia');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 card-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-accessible">
                NeuroAid Lite
              </h1>
              <p className="text-sm text-muted-foreground">
                Learning companion for everyone
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Accessibility First
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('home')}
              className="flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
            </Button>
            
            <Button
              variant={currentPage === 'reading' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('reading')}
              className="flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Reading</span>
            </Button>
            
            <Button
              variant={currentPage === 'math' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('math')}
              className="flex items-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden md:inline">Math</span>
            </Button>

            <Button
              variant={currentPage === 'writing' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPageChange('writing')}
              className="flex items-center space-x-2"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden md:inline">Writing</span>
            </Button>
          </nav>

          {/* Accessibility Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Contrast className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
                aria-label="Toggle high contrast mode"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              <Switch
                checked={dyslexiaFont}
                onCheckedChange={toggleDyslexiaFont}
                aria-label="Toggle dyslexia-friendly font"
              />
            </div>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}