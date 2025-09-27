import { Button } from "@/components/ui/button";
import { Eye, BarChart3, Settings, Home } from "lucide-react";

interface HeaderProps {
  currentPage: 'home' | 'detector' | 'analytics' | 'settings';
  onPageChange: (page: 'home' | 'detector' | 'analytics' | 'settings') => void;
}

const Header = ({ currentPage, onPageChange }: HeaderProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'detector', label: 'Detector', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-elegant">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">FocusGuard AI</h1>
          </div>
          
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(item.id as 'home' | 'detector' | 'analytics' | 'settings')}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;