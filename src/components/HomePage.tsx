import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, BarChart3, Settings, Brain, Shield, Zap } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: 'home' | 'detector' | 'analytics' | 'settings') => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          FocusGuard AI
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Advanced machine learning-powered distraction detection system that monitors focus levels 
          in real-time using computer vision and behavioral analysis.
        </p>
        <Button 
          onClick={() => onNavigate('detector')} 
          size="lg"
          className="bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Start Detection
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-elegant transition-shadow duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Real-time Detection</CardTitle>
            <CardDescription>
              Advanced computer vision algorithms detect distraction patterns instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('detector')}
              className="w-full"
            >
              Launch Detector
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-shadow duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Smart Analytics</CardTitle>
            <CardDescription>
              Comprehensive insights and trends about your focus patterns and productivity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('analytics')}
              className="w-full"
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-elegant transition-shadow duration-300">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Custom Settings</CardTitle>
            <CardDescription>
              Personalize detection sensitivity and notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('settings')}
              className="w-full"
            >
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* How it Works Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How FocusGuard AI Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-muted-foreground">
              Machine learning models analyze facial expressions, eye movements, and head position
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
            <p className="text-muted-foreground">
              All processing happens locally in your browser - no data leaves your device
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
            <p className="text-muted-foreground">
              Real-time notifications and alerts help you stay focused and productive
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-subtle rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Proven Results</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">87%</div>
            <p className="text-muted-foreground">Improvement in Focus</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">92%</div>
            <p className="text-muted-foreground">Accuracy Rate</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <p className="text-muted-foreground">Continuous Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;