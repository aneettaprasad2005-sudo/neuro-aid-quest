import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Target, 
  Trophy,
  Star,
  BookOpen,
  Calculator,
  PenTool,
  Eye,
  Ear,
  TrendingUp,
  Award,
  Zap,
  Heart,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

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
  recommendedTasks: Task[];
  focusAreas: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: JSX.Element;
  estimatedTime: number;
  points: number;
}

interface ResultsAnalysisProps {
  results: AssessmentResult[];
  onStartLearning: (profile: LearningProfile) => void;
}

export default function ResultsAnalysis({ results, onStartLearning }: ResultsAnalysisProps) {
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      const profile = generateLearningProfile(results);
      setLearningProfile(profile);
      setIsAnalyzing(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [results]);

  const generateLearningProfile = (results: AssessmentResult[]): LearningProfile => {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const maxPossible = results.reduce((sum, result) => sum + result.maxScore, 0);
    const overallPercentage = (totalScore / maxPossible) * 100;

    const overallLevel = overallPercentage >= 80 ? 'advanced' : 
                        overallPercentage >= 60 ? 'intermediate' : 'beginner';

    const strengths: string[] = [];
    const challenges: string[] = [];
    const focusAreas: string[] = [];

    results.forEach(result => {
      const percentage = (result.score / result.maxScore) * 100;
      if (percentage >= 75) {
        strengths.push(result.testName);
      } else if (percentage < 50) {
        challenges.push(result.testName);
        focusAreas.push(result.testName);
      }
    });

    const recommendedTasks = generateRecommendedTasks(results, overallLevel);

    return {
      overallLevel,
      strengths,
      challenges,
      recommendedTasks,
      focusAreas
    };
  };

  const generateRecommendedTasks = (results: AssessmentResult[], level: string): Task[] => {
    const tasks: Task[] = [];

    // Reading Tasks
    if (results.some(r => r.testName.includes("Word Recognition") && r.difficulty !== 'low')) {
      tasks.push({
        id: 'word-flash',
        title: 'Word Flash Cards',
        description: 'Practice recognizing common words quickly',
        difficulty: level === 'beginner' ? 'easy' : 'medium',
        category: 'Reading',
        icon: <Eye className="w-4 h-4" />,
        estimatedTime: 10,
        points: 50
      });
    }

    if (results.some(r => r.testName.includes("Reading Comprehension") && r.difficulty !== 'low')) {
      tasks.push({
        id: 'story-builder',
        title: 'Interactive Story Builder',
        description: 'Build stories while improving comprehension',
        difficulty: 'medium',
        category: 'Reading',
        icon: <BookOpen className="w-4 h-4" />,
        estimatedTime: 15,
        points: 75
      });
    }

    // Phonological Tasks
    if (results.some(r => r.testName.includes("Phonological") && r.difficulty !== 'low')) {
      tasks.push({
        id: 'rhyme-time',
        title: 'Rhyme Time Game',
        description: 'Match words that sound alike',
        difficulty: 'easy',
        category: 'Sounds',
        icon: <Ear className="w-4 h-4" />,
        estimatedTime: 8,
        points: 40
      });

      tasks.push({
        id: 'syllable-clap',
        title: 'Syllable Clapping',
        description: 'Break words into parts with rhythm',
        difficulty: 'easy',
        category: 'Sounds',
        icon: <Zap className="w-4 h-4" />,
        estimatedTime: 12,
        points: 60
      });
    }

    // Visual Processing Tasks
    if (results.some(r => r.testName.includes("Visual Processing") && r.difficulty !== 'low')) {
      tasks.push({
        id: 'pattern-master',
        title: 'Pattern Master',
        description: 'Complete increasingly complex visual patterns',
        difficulty: 'medium',
        category: 'Visual',
        icon: <Target className="w-4 h-4" />,
        estimatedTime: 10,
        points: 65
      });
    }

    // Letter Reversal Tasks
    if (results.some(r => r.testName.includes("Letter Reversal") && r.difficulty !== 'low')) {
      tasks.push({
        id: 'letter-detective',
        title: 'Letter Detective',
        description: 'Spot and fix reversed letters',
        difficulty: 'easy',
        category: 'Letters',
        icon: <Eye className="w-4 h-4" />,
        estimatedTime: 8,
        points: 45
      });

      tasks.push({
        id: 'mirror-letters',
        title: 'Mirror Letter Challenge',
        description: 'Practice with commonly confused letters',
        difficulty: 'medium',
        category: 'Letters',
        icon: <Brain className="w-4 h-4" />,
        estimatedTime: 12,
        points: 70
      });
    }

    // Writing Tasks
    tasks.push({
      id: 'word-builder',
      title: 'Word Builder Workshop',
      description: 'Build words letter by letter with support',
      difficulty: level === 'beginner' ? 'easy' : 'medium',
      category: 'Writing',
      icon: <PenTool className="w-4 h-4" />,
      estimatedTime: 15,
      points: 80
    });

    // Math Tasks for comprehensive learning
    tasks.push({
      id: 'number-bonds',
      title: 'Number Bonds Explorer',
      description: 'Discover number relationships visually',
      difficulty: 'easy',
      category: 'Math',
      icon: <Calculator className="w-4 h-4" />,
      estimatedTime: 12,
      points: 55
    });

    return tasks.slice(0, 8); // Return top 8 recommendations
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 75) return 'success';
    if (percentage >= 50) return 'warning';
    return 'destructive';
  };

  if (isAnalyzing) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-accessible">Analyzing Your Results</h1>
          <p className="text-xl text-muted-foreground">
            Our AI is creating your personalized learning profile...
          </p>
          
          <div className="space-y-4">
            <Progress value={33} className="h-2" />
            <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Processing responses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <span>AI analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span>Task generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!learningProfile) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-success-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-accessible">Your Learning Profile</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Based on your assessment, we've created a personalized learning journey just for you!
        </p>
      </div>

      {/* Overall Results */}
      <Card className="card-soft bg-gradient-to-br from-success/5 to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6" />
            <span>Assessment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {learningProfile.overallLevel.charAt(0).toUpperCase() + learningProfile.overallLevel.slice(1)}
              </div>
              <div className="text-sm text-muted-foreground">Overall Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">
                {results.reduce((sum, result) => sum + result.score, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Score / {results.reduce((sum, result) => sum + result.maxScore, 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-warning mb-2">
                {learningProfile.recommendedTasks.length}
              </div>
              <div className="text-sm text-muted-foreground">Personalized Tasks</div>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="font-semibold text-success flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>Your Strengths</span>
              </h3>
              {learningProfile.strengths.length > 0 ? (
                <div className="space-y-2">
                  {learningProfile.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="mr-2">
                      {strength}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keep practicing! Every step forward is progress.
                </p>
              )}
            </div>

            {/* Growth Areas */}
            <div className="space-y-3">
              <h3 className="font-semibold text-primary flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Growth Opportunities</span>
              </h3>
              {learningProfile.challenges.length > 0 ? (
                <div className="space-y-2">
                  {learningProfile.challenges.map((challenge, index) => (
                    <Badge key={index} variant="outline" className="mr-2">
                      {challenge}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Great job! You're performing well across all areas.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Detailed Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-semibold">{result.testName}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getScoreColor(result.score, result.maxScore) as any}>
                      {result.score}/{result.maxScore}
                    </Badge>
                    <Badge variant={getDifficultyColor(result.difficulty) as any}>
                      {result.difficulty} difficulty
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(result.timeSpent / 1000)}s
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {Math.round((result.score / result.maxScore) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Tasks */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6" />
            <span>Your Personalized Learning Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningProfile.recommendedTasks.map((task, index) => (
              <Card key={task.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {task.icon}
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                    <Badge variant={task.difficulty === 'easy' ? 'secondary' : task.difficulty === 'medium' ? 'default' : 'destructive'}>
                      {task.difficulty}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-warning" />
                      <span>{task.points} points</span>
                    </div>
                    <span className="text-muted-foreground">{task.estimatedTime} min</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Tips */}
      <Card className="card-soft bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-6 h-6" />
            <span>Personalized Learning Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Based on Your Results:</h4>
              <ul className="space-y-2 text-sm">
                {learningProfile.focusAreas.includes('Word Recognition Speed') && (
                  <li className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <span>Practice word recognition daily for 10-15 minutes to build fluency</span>
                  </li>
                )}
                {learningProfile.focusAreas.includes('Letter Reversal Detection') && (
                  <li className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <span>Use multisensory techniques - trace letters while saying them aloud</span>
                  </li>
                )}
                {learningProfile.focusAreas.includes('Phonological Awareness') && (
                  <li className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <span>Play rhyming games and break words into syllables regularly</span>
                  </li>
                )}
                {learningProfile.focusAreas.includes('Visual Processing Speed') && (
                  <li className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <span>Start with simple patterns and gradually increase complexity</span>
                  </li>
                )}
                <li className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-primary mt-0.5" />
                  <span>Use the OpenDyslexic font and high-contrast mode for easier reading</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-success">General Success Strategies:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Take breaks every 15-20 minutes to stay fresh</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Celebrate small victories - every improvement counts!</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Use text-to-speech tools to support reading comprehension</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Practice in a quiet, well-lit environment</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={() => onStartLearning(learningProfile)}
          className="bg-gradient-primary text-lg px-12 py-6"
        >
          <Trophy className="w-5 h-5 mr-2" />
          Start My Learning Journey
        </Button>
      </div>
    </div>
  );
}