import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calculator, 
  Users, 
  Heart,
  Zap,
  Shield,
  Brain,
  Star,
  ArrowRight,
  PenTool,
  Target,
  Award,
  Trophy,
  Eye
} from "lucide-react";

interface HomePageProps {
  onNavigate: (page: 'reading' | 'math' | 'writing' | 'assessment' | 'learning') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-secondary/10">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge 
              variant="secondary" 
              className="bg-gradient-success text-success-foreground px-4 py-2 text-sm font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              Designed with Empathy
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground font-accessible text-shadow leading-tight">
              Learning Made
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Accessible</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive learning companion specifically designed for students with 
              <strong className="text-primary"> dyslexia</strong> and 
              <strong className="text-primary"> dyscalculia</strong>. 
              Built with research-backed accessibility features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:scale-105 transform transition-all duration-300 text-lg px-8 py-6"
                onClick={() => onNavigate('assessment')}
              >
                <Brain className="w-5 h-5 mr-2" />
                Take Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="hover:scale-105 transform transition-all duration-300 text-lg px-8 py-6"
                onClick={() => onNavigate('reading')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Reading Tools
              </Button>

              <Button 
                variant="secondary" 
                size="lg"
                className="hover:scale-105 transform transition-all duration-300 text-lg px-8 py-6"
                onClick={() => onNavigate('math')}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Math Helper
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-accessible">
              Built for Every Learner
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Research-backed features that address the specific challenges faced by students with learning differences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Assessment Card - Featured */}
            <Card className="card-soft interactive hover:border-primary/50 group md:col-span-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-accessible">AI-Powered Assessment</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive dyslexia assessment with personalized learning recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm">5 comprehensive tests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm">AI-powered analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm">Personalized tasks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="text-sm">Progress tracking</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-primary" 
                  onClick={() => onNavigate('assessment')}
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Reading Support Card */}
            <Card className="card-soft interactive hover:border-primary/50 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-success-foreground" />
                </div>
                <CardTitle className="text-xl font-accessible">Reading Tools</CardTitle>
                <CardDescription className="text-base">
                  Synchronized text-to-speech with real-time highlighting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-success" />
                    <span className="text-sm">Perfect synchronization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-sm">Visual stress reduction</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-success" />
                    <span className="text-sm">Word highlighting</span>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full" 
                  onClick={() => onNavigate('reading')}
                >
                  Try Reading Tool
                </Button>
              </CardContent>
            </Card>

            {/* Math Visualization Card */}
            <Card className="card-soft interactive hover:border-primary/50 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl font-accessible">Math Visualizer</CardTitle>
                <CardDescription className="text-base">
                  Interactive number representations for dyscalculia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="text-sm">Color-coded numbers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-warning" />
                    <span className="text-sm">Step-by-step solving</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-warning" />
                    <span className="text-sm">Visual patterns</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onNavigate('math')}
                >
                  Explore Math Tools
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-accessible">
              Supporting Learning Differences
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15-20%</div>
              <p className="text-muted-foreground">of students have dyslexia</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-warning mb-2">5-7%</div>
              <p className="text-muted-foreground">have dyscalculia</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">100%</div>
              <p className="text-muted-foreground">deserve accessible education</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}