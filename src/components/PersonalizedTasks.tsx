import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Play,
  Star,
  Trophy,
  Target,
  Clock,
  CheckCircle,
  Lock,
  Flame,
  Award,
  Zap,
  Brain,
  Eye,
  Ear,
  PenTool,
  BookOpen,
  Calculator,
  RotateCcw,
  Volume2,
  XCircle,
  Heart,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface LearningProfile {
  overallLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  challenges: string[];
  recommendedTasks: Task[];
  focusAreas: string[];
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  tasksCompleted: number;
  completedTasks: string[];
  achievements: string[];
}

interface PersonalizedTasksProps {
  learningProfile: LearningProfile;
}

export default function PersonalizedTasks({ learningProfile }: PersonalizedTasksProps) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    streak: 0,
    tasksCompleted: 0,
    completedTasks: [],
    achievements: []
  });
  
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isTaskActive, setIsTaskActive] = useState(false);
  const { toast } = useToast();

  const achievements = [
    { id: 'first_task', name: 'Getting Started', description: 'Complete your first task', icon: <Star className="w-4 h-4" />, requirement: 1 },
    { id: 'streak_3', name: 'On Fire', description: 'Complete 3 tasks in a row', icon: <Flame className="w-4 h-4" />, requirement: 3 },
    { id: 'points_100', name: 'Century Club', description: 'Earn 100 points', icon: <Trophy className="w-4 h-4" />, requirement: 100 },
    { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: <Award className="w-4 h-4" />, requirement: 5 },
  ];

  const getLevelProgress = () => {
    const pointsForNextLevel = userProgress.level * 100;
    const pointsInCurrentLevel = userProgress.totalPoints % 100;
    return (pointsInCurrentLevel / pointsForNextLevel) * 100;
  };

  const startTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskActive(true);
    toast({
      title: `Starting ${task.title}`,
      description: `Let's work on ${task.category.toLowerCase()} skills!`,
    });
  };

  const completeTask = (task: Task, success: boolean = true) => {
    if (success && !userProgress.completedTasks.includes(task.id)) {
      const newProgress = {
        ...userProgress,
        totalPoints: userProgress.totalPoints + task.points,
        tasksCompleted: userProgress.tasksCompleted + 1,
        completedTasks: [...userProgress.completedTasks, task.id],
        streak: userProgress.streak + 1,
        level: Math.floor((userProgress.totalPoints + task.points) / 100) + 1
      };
      
      setUserProgress(newProgress);
      
      // Check for new achievements
      checkAchievements(newProgress);
      
      toast({
        title: "Task Completed! 🎉",
        description: `You earned ${task.points} points! Keep up the great work.`,
      });
    }
    
    setCurrentTask(null);
    setIsTaskActive(false);
  };

  const checkAchievements = (progress: UserProgress) => {
    achievements.forEach(achievement => {
      if (!progress.achievements.includes(achievement.id)) {
        let achieved = false;
        
        switch (achievement.id) {
          case 'first_task':
            achieved = progress.tasksCompleted >= 1;
            break;
          case 'streak_3':
            achieved = progress.streak >= 3;
            break;
          case 'points_100':
            achieved = progress.totalPoints >= 100;
            break;
          case 'level_5':
            achieved = progress.level >= 5;
            break;
        }
        
        if (achieved) {
          setUserProgress(prev => ({
            ...prev,
            achievements: [...prev.achievements, achievement.id]
          }));
          
          toast({
            title: "Achievement Unlocked! 🏆",
            description: `${achievement.name}: ${achievement.description}`,
          });
        }
      }
    });
  };

  if (isTaskActive && currentTask) {
    return <TaskInterface task={currentTask} onComplete={completeTask} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-accessible">Your Learning Journey</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Complete personalized tasks designed specifically for your learning needs
        </p>
      </div>

      {/* Progress Dashboard */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="card-soft">
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
        
        <Card className="card-soft">
          <CardContent className="pt-6 text-center">
            <Star className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">Level {userProgress.level}</div>
            <Progress value={getLevelProgress()} className="mt-2 h-1" />
          </CardContent>
        </Card>
        
        <Card className="card-soft">
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 text-destructive mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        
        <Card className="card-soft">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">{userProgress.tasksCompleted}</div>
            <div className="text-sm text-muted-foreground">Tasks Done</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="card-soft bg-gradient-to-r from-warning/5 to-success/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-6 h-6" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 text-center ${
                  userProgress.achievements.includes(achievement.id)
                    ? 'border-success bg-success/10'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  userProgress.achievements.includes(achievement.id)
                    ? 'bg-success text-success-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {achievement.icon}
                </div>
                <h4 className="font-semibold text-sm">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Tasks */}
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6" />
            <span>Your Personalized Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningProfile.recommendedTasks.map((task, index) => {
              const isCompleted = userProgress.completedTasks.includes(task.id);
              const isLocked = index > userProgress.tasksCompleted && index > 0;
              
              return (
                <Card
                  key={task.id}
                  className={`relative transition-all duration-300 ${
                    isCompleted
                      ? 'border-success bg-success/5'
                      : isLocked
                      ? 'border-muted opacity-60'
                      : 'hover:border-primary/50 cursor-pointer interactive'
                  }`}
                >
                  <CardContent className="pt-6 space-y-4">
                    {/* Task Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-full ${
                          isCompleted ? 'bg-success text-success-foreground' : 
                          isLocked ? 'bg-muted text-muted-foreground' : 'bg-primary/10'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : 
                           isLocked ? <Lock className="w-4 h-4" /> : task.icon}
                        </div>
                        <Badge variant="outline">{task.category}</Badge>
                      </div>
                      <Badge 
                        variant={
                          task.difficulty === 'easy' ? 'secondary' : 
                          task.difficulty === 'medium' ? 'default' : 'destructive'
                        }
                      >
                        {task.difficulty}
                      </Badge>
                    </div>

                    {/* Task Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>

                    {/* Task Meta */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-warning" />
                          <span>{task.points} pts</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{task.estimatedTime}m</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                      disabled={isLocked}
                      onClick={() => !isCompleted && !isLocked && startTask(task)}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : isLocked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Task
                        </>
                      )}
                    </Button>

                    {/* Progress Indicator */}
                    {index === userProgress.tasksCompleted && !isCompleted && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-primary animate-pulse">Next!</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Progress */}
      <Card className="card-soft bg-gradient-to-r from-primary/5 to-success/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6" />
            <span>Today's Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold text-primary">
            {userProgress.tasksCompleted > 0 ? "Great Job!" : "Ready to Start?"}
          </div>
          <p className="text-muted-foreground">
            {userProgress.tasksCompleted > 0
              ? `You've completed ${userProgress.tasksCompleted} tasks today and earned ${userProgress.totalPoints} points!`
              : "Begin your learning journey with your first personalized task."
            }
          </p>
          
          {userProgress.tasksCompleted === 0 && (
            <Button 
              size="lg"
              className="bg-gradient-primary"
              onClick={() => startTask(learningProfile.recommendedTasks[0])}
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Learning Now
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Task Interface Component
function TaskInterface({ task, onComplete }: { task: Task, onComplete: (task: Task, success: boolean) => void }) {
  const [taskProgress, setTaskProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate different task types based on category
  const renderTaskContent = () => {
    switch (task.category) {
      case 'Reading':
        return <ReadingTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
      case 'Sounds':
        return <SoundTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
      case 'Visual':
        return <VisualTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
      case 'Letters':
        return <LetterTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
      case 'Writing':
        return <WritingTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
      case 'Math':
        return <MathTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
      default:
        return <DefaultTaskContent task={task} onProgress={setTaskProgress} onComplete={onComplete} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Task Header */}
      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {task.icon}
              <div>
                <CardTitle>{task.title}</CardTitle>
                <p className="text-muted-foreground">{task.description}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge variant="outline">{task.category}</Badge>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(taskProgress)}%</span>
            </div>
            <Progress value={taskProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Task Content */}
      {renderTaskContent()}

      {/* Task Controls */}
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={() => onComplete(task, false)}>
          <XCircle className="w-4 h-4 mr-2" />
          Exit Task
        </Button>
      </div>
    </div>
  );
}

// Individual Task Content Components
function ReadingTaskContent({ task, onProgress, onComplete }: any) {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['cat', 'dog', 'house', 'tree', 'happy', 'jump', 'read', 'book', 'smile', 'learn'];

  useEffect(() => {
    onProgress((currentWord / words.length) * 100);
  }, [currentWord, words.length, onProgress]);

  const handleWordRecognition = (isCorrect: boolean) => {
    if (currentWord < words.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      onComplete(task, true);
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-8 text-center">
        <h3 className="text-2xl font-bold">Word Recognition Practice</h3>
        <div className="text-6xl font-bold font-opendyslexic p-8 bg-muted/30 rounded-lg">
          {words[currentWord]}
        </div>
        <p className="text-muted-foreground">Read this word aloud, then click "Got It!"</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => handleWordRecognition(true)} className="bg-gradient-success">
            <CheckCircle className="w-4 h-4 mr-2" />
            Got It!
          </Button>
          <Button variant="outline" onClick={() => handleWordRecognition(false)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SoundTaskContent({ task, onProgress, onComplete }: any) {
  const [currentRhyme, setCurrentRhyme] = useState(0);
  const rhymes = [
    { word: 'cat', options: ['bat', 'dog', 'car', 'sun'], correct: 0 },
    { word: 'tree', options: ['car', 'bee', 'dog', 'hat'], correct: 1 },
    { word: 'sun', options: ['moon', 'star', 'fun', 'car'], correct: 2 }
  ];

  useEffect(() => {
    onProgress((currentRhyme / rhymes.length) * 100);
  }, [currentRhyme, onProgress]);

  const handleAnswer = (index: number) => {
    if (currentRhyme < rhymes.length - 1) {
      setCurrentRhyme(currentRhyme + 1);
    } else {
      onComplete(task, true);
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6 text-center">
        <h3 className="text-2xl font-bold">Rhyme Time!</h3>
        <div className="space-y-4">
          <p className="text-lg">Which word rhymes with:</p>
          <div className="text-4xl font-bold font-opendyslexic text-primary">
            {rhymes[currentRhyme].word}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {rhymes[currentRhyme].options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(index)}
              className="text-lg font-opendyslexic"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function VisualTaskContent({ task, onProgress, onComplete }: any) {
  const [currentPattern, setCurrentPattern] = useState(0);
  const patterns = [
    { sequence: ['🔴', '🔵', '🔴', '🔵'], answer: '🔴' },
    { sequence: ['⭐', '⭐', '🌙', '⭐', '⭐'], answer: '🌙' },
    { sequence: ['1', '2', '3', '4'], answer: '5' }
  ];

  useEffect(() => {
    onProgress((currentPattern / patterns.length) * 100);
  }, [currentPattern, onProgress]);

  const handleContinue = () => {
    if (currentPattern < patterns.length - 1) {
      setCurrentPattern(currentPattern + 1);
    } else {
      onComplete(task, true);
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6 text-center">
        <h3 className="text-2xl font-bold">Pattern Recognition</h3>
        <div className="space-y-4">
          <p>What comes next in this pattern?</p>
          <div className="text-4xl space-x-4">
            {patterns[currentPattern].sequence.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
            <span className="text-primary">?</span>
          </div>
          <div className="text-2xl font-bold text-success">
            Answer: {patterns[currentPattern].answer}
          </div>
        </div>
        <Button onClick={handleContinue} className="bg-gradient-primary">
          <CheckCircle className="w-4 h-4 mr-2" />
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}

function LetterTaskContent({ task, onProgress, onComplete }: any) {
  const [currentLetter, setCurrentLetter] = useState(0);
  const letters = ['b', 'd', 'p', 'q', 'm', 'w', 'n', 'u'];

  useEffect(() => {
    onProgress((currentLetter / letters.length) * 100);
  }, [currentLetter, onProgress]);

  const handleNext = () => {
    if (currentLetter < letters.length - 1) {
      setCurrentLetter(currentLetter + 1);
    } else {
      onComplete(task, true);
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6 text-center">
        <h3 className="text-2xl font-bold">Letter Practice</h3>
        <div className="text-8xl font-bold font-opendyslexic p-8 bg-muted/30 rounded-lg">
          {letters[currentLetter]}
        </div>
        <p className="text-muted-foreground">Trace this letter with your finger and say its name</p>
        <Button onClick={handleNext} className="bg-gradient-primary">
          <CheckCircle className="w-4 h-4 mr-2" />
          Next Letter
        </Button>
      </CardContent>
    </Card>
  );
}

function WritingTaskContent({ task, onProgress, onComplete }: any) {
  const [writtenWords, setWrittenWords] = useState(0);
  const targetWords = ['cat', 'dog', 'sun', 'fun', 'big'];

  useEffect(() => {
    onProgress((writtenWords / targetWords.length) * 100);
  }, [writtenWords, onProgress]);

  const handleWordComplete = () => {
    if (writtenWords < targetWords.length - 1) {
      setWrittenWords(writtenWords + 1);
    } else {
      onComplete(task, true);
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6 text-center">
        <h3 className="text-2xl font-bold">Writing Practice</h3>
        <div className="space-y-4">
          <p>Practice writing this word:</p>
          <div className="text-4xl font-bold font-opendyslexic text-primary">
            {targetWords[writtenWords]}
          </div>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Write the word on paper or trace with your finger</p>
          <div className="border-2 border-dashed border-muted p-8 rounded-lg">
            Practice Space
          </div>
        </div>
        <Button onClick={handleWordComplete} className="bg-gradient-success">
          <CheckCircle className="w-4 h-4 mr-2" />
          I Wrote It!
        </Button>
      </CardContent>
    </Card>
  );
}

function MathTaskContent({ task, onProgress, onComplete }: any) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const problems = [
    { question: '2 + 3', answer: 5, visual: [2, 3] },
    { question: '5 - 2', answer: 3, visual: [5, 2] },
    { question: '3 + 4', answer: 7, visual: [3, 4] }
  ];

  useEffect(() => {
    onProgress((currentProblem / problems.length) * 100);
  }, [currentProblem, onProgress]);

  const handleNext = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1);
    } else {
      onComplete(task, true);
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6 text-center">
        <h3 className="text-2xl font-bold">Visual Math</h3>
        <div className="space-y-4">
          <div className="text-3xl font-bold">{problems[currentProblem].question} = ?</div>
          <div className="flex justify-center space-x-4">
            {problems[currentProblem].visual.map((num, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  {Array.from({ length: num }, (_, i) => (
                    <div key={i} className="w-6 h-6 bg-primary rounded" />
                  ))}
                </div>
                <div className="text-lg font-bold">{num}</div>
              </div>
            ))}
          </div>
          <div className="text-2xl font-bold text-success">
            Answer: {problems[currentProblem].answer}
          </div>
        </div>
        <Button onClick={handleNext} className="bg-gradient-primary">
          <CheckCircle className="w-4 h-4 mr-2" />
          Next Problem
        </Button>
      </CardContent>
    </Card>
  );
}

function DefaultTaskContent({ task, onProgress, onComplete }: any) {
  useEffect(() => {
    onProgress(100);
  }, [onProgress]);

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-6 text-center">
        <h3 className="text-2xl font-bold">{task.title}</h3>
        <p className="text-muted-foreground">{task.description}</p>
        <Button onClick={() => onComplete(task, true)} className="bg-gradient-primary">
          <CheckCircle className="w-4 h-4 mr-2" />
          Complete Task
        </Button>
      </CardContent>
    </Card>
  );
}