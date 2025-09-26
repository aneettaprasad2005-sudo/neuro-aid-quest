import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Timer, 
  Eye, 
  Ear, 
  Target,
  CheckCircle,
  XCircle,
  RotateCw,
  Play,
  Star,
  Trophy,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssessmentResult {
  testName: string;
  score: number;
  maxScore: number;
  difficulty: 'low' | 'medium' | 'high';
  timeSpent: number;
  errors: string[];
}

interface AssessmentModuleProps {
  onComplete: (results: AssessmentResult[]) => void;
}

export default function AssessmentModule({ onComplete }: AssessmentModuleProps) {
  const [currentTest, setCurrentTest] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [testStartTime, setTestStartTime] = useState(0);
  const { toast } = useToast();

  const assessmentTests = [
    {
      name: "Word Recognition Speed",
      description: "Identify real words vs nonsense words quickly",
      icon: <Eye className="w-6 h-6" />,
      component: WordRecognitionTest
    },
    {
      name: "Letter Reversal Detection", 
      description: "Spot letters that are commonly reversed",
      icon: <RotateCw className="w-6 h-6" />,
      component: LetterReversalTest
    },
    {
      name: "Phonological Awareness",
      description: "Sound pattern recognition and manipulation",
      icon: <Ear className="w-6 h-6" />,
      component: PhonologicalTest
    },
    {
      name: "Visual Processing Speed",
      description: "Process visual information quickly and accurately",
      icon: <Zap className="w-6 h-6" />,
      component: VisualProcessingTest
    },
    {
      name: "Reading Comprehension",
      description: "Understand and analyze text passages",
      icon: <Brain className="w-6 h-6" />,
      component: ReadingComprehensionTest
    }
  ];

  const startAssessment = () => {
    setCurrentTest(0);
    setResults([]);
    setIsRunning(true);
    setTestStartTime(Date.now());
    toast({
      title: "Assessment Started!",
      description: "Complete all tests for personalized learning recommendations.",
    });
  };

  const completeCurrentTest = (result: AssessmentResult) => {
    const newResults = [...results, result];
    setResults(newResults);
    
    if (currentTest < assessmentTests.length - 1) {
      setCurrentTest(currentTest + 1);
      setTestStartTime(Date.now());
    } else {
      setIsRunning(false);
      onComplete(newResults);
      toast({
        title: "Assessment Complete!",
        description: "Analyzing results to create your personalized learning path...",
      });
    }
  };

  if (!isRunning && results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-accessible">Dyslexia Assessment</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete our comprehensive assessment to get personalized learning recommendations tailored to your unique needs.
          </p>
        </div>

        {/* Assessment Overview */}
        <Card className="card-soft max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Assessment Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessmentTests.map((test, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      {test.icon}
                    </div>
                    <h3 className="font-semibold">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Separator />
            
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">~10</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">∞</div>
                  <div className="text-sm text-muted-foreground">Personalized Tasks</div>
                </div>
              </div>
              
              <Button 
                size="lg" 
                onClick={startAssessment}
                className="bg-gradient-primary text-lg px-8 py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="text-center card-soft">
            <CardContent className="pt-6 space-y-3">
              <Target className="w-10 h-10 text-primary mx-auto" />
              <h3 className="font-semibold">Personalized Learning</h3>
              <p className="text-sm text-muted-foreground">
                Get tasks specifically designed for your learning style and challenges
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center card-soft">
            <CardContent className="pt-6 space-y-3">
              <Trophy className="w-10 h-10 text-success mx-auto" />
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor improvement with detailed analytics and achievement badges
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center card-soft">
            <CardContent className="pt-6 space-y-3">
              <Star className="w-10 h-10 text-warning mx-auto" />
              <h3 className="font-semibold">Adaptive Difficulty</h3>
              <p className="text-sm text-muted-foreground">
                Tasks automatically adjust difficulty based on your performance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isRunning) {
    const CurrentTestComponent = assessmentTests[currentTest].component;
    
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Progress Header */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Assessment Progress</h2>
            <Badge variant="outline">
              Test {currentTest + 1} of {assessmentTests.length}
            </Badge>
          </div>
          
          <Progress 
            value={(currentTest / assessmentTests.length) * 100} 
            className="h-2"
          />
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary">
              {assessmentTests[currentTest].name}
            </h3>
            <p className="text-muted-foreground">
              {assessmentTests[currentTest].description}
            </p>
          </div>
        </div>

        {/* Current Test */}
        <CurrentTestComponent
          onComplete={completeCurrentTest}
          startTime={testStartTime}
        />
      </div>
    );
  }

  return null;
}

// Individual Test Components
function WordRecognitionTest({ onComplete, startTime }: any) {
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const words = [
    { word: "HOUSE", isReal: true },
    { word: "BLART", isReal: false },
    { word: "FRIEND", isReal: true },
    { word: "TRAND", isReal: false },
    { word: "SCHOOL", isReal: true },
    { word: "GLOME", isReal: false },
    { word: "HAPPY", isReal: true },
    { word: "FLIBE", isReal: false },
    { word: "WATER", isReal: true },
    { word: "GRIND", isReal: true }
  ];

  const handleAnswer = (isReal: boolean) => {
    const correct = words[currentWord].isReal === isReal;
    if (correct) {
      setScore(score + 1);
    } else {
      setErrors([...errors, `${words[currentWord].word}: guessed ${isReal ? 'real' : 'fake'}`]);
    }

    if (currentWord < words.length - 1) {
      setCurrentWord(currentWord + 1);
    } else {
      const timeSpent = Date.now() - startTime;
      const difficulty = score >= 8 ? 'low' : score >= 6 ? 'medium' : 'high';
      
      onComplete({
        testName: "Word Recognition Speed",
        score,
        maxScore: words.length,
        difficulty,
        timeSpent,
        errors
      });
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Is this a real word?</CardTitle>
          <Badge>{currentWord + 1}/{words.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="text-center">
          <div className="text-6xl font-bold font-opendyslexic mb-8 p-8 bg-muted/30 rounded-lg">
            {words[currentWord].word}
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => handleAnswer(true)}
            className="bg-gradient-success text-lg px-8"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Real Word
          </Button>
          <Button 
            size="lg" 
            variant="destructive"
            onClick={() => handleAnswer(false)}
            className="text-lg px-8"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Fake Word
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Score: {score}/{currentWord + 1}
        </div>
      </CardContent>
    </Card>
  );
}

function LetterReversalTest({ onComplete, startTime }: any) {
  const [currentPair, setCurrentPair] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const letterPairs = [
    { letters: ["b", "d"], areReversed: true },
    { letters: ["p", "q"], areReversed: true },
    { letters: ["n", "u"], areReversed: false },
    { letters: ["6", "9"], areReversed: true },
    { letters: ["m", "w"], areReversed: true },
    { letters: ["h", "n"], areReversed: false },
    { letters: ["s", "z"], areReversed: false },
    { letters: ["E", "3"], areReversed: true },
  ];

  const handleAnswer = (areReversed: boolean) => {
    const correct = letterPairs[currentPair].areReversed === areReversed;
    if (correct) {
      setScore(score + 1);
    } else {
      setErrors([...errors, `${letterPairs[currentPair].letters.join(' & ')}: said ${areReversed ? 'reversed' : 'not reversed'}`]);
    }

    if (currentPair < letterPairs.length - 1) {
      setCurrentPair(currentPair + 1);
    } else {
      const timeSpent = Date.now() - startTime;
      const difficulty = score >= 7 ? 'low' : score >= 5 ? 'medium' : 'high';
      
      onComplete({
        testName: "Letter Reversal Detection",
        score,
        maxScore: letterPairs.length,
        difficulty,
        timeSpent,
        errors
      });
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Are these letters commonly reversed?</CardTitle>
          <Badge>{currentPair + 1}/{letterPairs.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-8 p-8 bg-muted/30 rounded-lg">
            <div className="text-8xl font-bold font-opendyslexic">
              {letterPairs[currentPair].letters[0]}
            </div>
            <div className="text-4xl text-muted-foreground">&</div>
            <div className="text-8xl font-bold font-opendyslexic">
              {letterPairs[currentPair].letters[1]}
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => handleAnswer(true)}
            className="bg-gradient-warm text-lg px-8"
          >
            <RotateCw className="w-5 h-5 mr-2" />
            Often Reversed
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => handleAnswer(false)}
            className="text-lg px-8"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Not Reversed
          </Button>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Score: {score}/{currentPair + 1}
        </div>
      </CardContent>
    </Card>
  );
}

function PhonologicalTest({ onComplete, startTime }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const questions = [
    {
      question: "Which word rhymes with 'cat'?",
      options: ["dog", "hat", "sun", "tree"],
      correct: 1
    },
    {
      question: "How many syllables in 'butterfly'?",
      options: ["2", "3", "4", "5"],
      correct: 1
    },
    {
      question: "What sound does 'ph' make in 'phone'?",
      options: ["p", "f", "ph", "h"],
      correct: 1
    },
    {
      question: "Which word starts with the same sound as 'ship'?",
      options: ["chair", "shoe", "thumb", "fish"],
      correct: 1
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const correct = questions[currentQuestion].correct === optionIndex;
    if (correct) {
      setScore(score + 1);
    } else {
      setErrors([...errors, `Q${currentQuestion + 1}: chose "${questions[currentQuestion].options[optionIndex]}"`]);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const timeSpent = Date.now() - startTime;
      const difficulty = score >= 3 ? 'low' : score >= 2 ? 'medium' : 'high';
      
      onComplete({
        testName: "Phonological Awareness",
        score,
        maxScore: questions.length,
        difficulty,
        timeSpent,
        errors
      });
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sound Patterns</CardTitle>
          <Badge>{currentQuestion + 1}/{questions.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-6 font-accessible">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleAnswer(index)}
                className="text-lg p-6 font-opendyslexic"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Score: {score}/{currentQuestion + 1}
        </div>
      </CardContent>
    </Card>
  );
}

function VisualProcessingTest({ onComplete, startTime }: any) {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [timeLimit] = useState(3000); // 3 seconds per pattern
  const [timeLeft, setTimeLeft] = useState(3000);
  const timerRef = useRef<NodeJS.Timeout>();

  const patterns = [
    {
      sequence: ["🔴", "🔵", "🔴", "🔵", "?"],
      options: ["🔴", "🔵", "🟢", "🟡"],
      correct: 0
    },
    {
      sequence: ["▲", "▼", "▲", "▼", "?"],
      options: ["▲", "▼", "◆", "●"],
      correct: 0
    },
    {
      sequence: ["1", "2", "4", "8", "?"],
      options: ["12", "16", "10", "9"],
      correct: 1
    }
  ];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          handleTimeout();
          return 3000;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPattern]);

  const handleTimeout = () => {
    setErrors([...errors, `Pattern ${currentPattern + 1}: timeout`]);
    nextPattern();
  };

  const handleAnswer = (optionIndex: number) => {
    const correct = patterns[currentPattern].correct === optionIndex;
    if (correct) {
      setScore(score + 1);
    } else {
      setErrors([...errors, `Pattern ${currentPattern + 1}: wrong choice`]);
    }
    nextPattern();
  };

  const nextPattern = () => {
    if (currentPattern < patterns.length - 1) {
      setCurrentPattern(currentPattern + 1);
      setTimeLeft(3000);
    } else {
      const timeSpent = Date.now() - startTime;
      const difficulty = score >= 2 ? 'low' : score >= 1 ? 'medium' : 'high';
      
      if (timerRef.current) clearInterval(timerRef.current);
      
      onComplete({
        testName: "Visual Processing Speed",
        score,
        maxScore: patterns.length,
        difficulty,
        timeSpent,
        errors
      });
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Complete the Pattern</CardTitle>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4" />
            <Badge variant={timeLeft < 1000 ? "destructive" : "outline"}>
              {Math.ceil(timeLeft / 1000)}s
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={(timeLeft / 3000) * 100} className="h-2" />
        
        <div className="text-center">
          <div className="flex justify-center items-center space-x-4 text-6xl mb-8 p-6 bg-muted/30 rounded-lg">
            {patterns[currentPattern].sequence.map((item, index) => (
              <span key={index} className={item === "?" ? "text-primary" : ""}>
                {item}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {patterns[currentPattern].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleAnswer(index)}
                className="text-4xl p-8"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Pattern {currentPattern + 1} of {patterns.length}
        </div>
      </CardContent>
    </Card>
  );
}

function ReadingComprehensionTest({ onComplete, startTime }: any) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const passage = "The sun was setting behind the mountains, painting the sky in brilliant shades of orange and pink. Sarah sat by the lake, watching the ducks swim peacefully in the calm water. She had come here to think about her future and make an important decision about college.";

  const questions = [
    {
      question: "Where was Sarah sitting?",
      options: ["By the mountains", "By the lake", "In college", "At home"],
      correct: 1
    },
    {
      question: "What time of day was it?",
      options: ["Morning", "Afternoon", "Evening", "Night"],
      correct: 2
    },
    {
      question: "What was Sarah thinking about?",
      options: ["The ducks", "The sunset", "Her future", "The water"],
      correct: 2
    }
  ];

  const handleAnswer = (optionIndex: number) => {
    const correct = questions[currentQuestion].correct === optionIndex;
    if (correct) {
      setScore(score + 1);
    } else {
      setErrors([...errors, `Reading Q${currentQuestion + 1}: wrong answer`]);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const timeSpent = Date.now() - startTime;
      const difficulty = score >= 2 ? 'low' : score >= 1 ? 'medium' : 'high';
      
      onComplete({
        testName: "Reading Comprehension",
        score,
        maxScore: questions.length,
        difficulty,
        timeSpent,
        errors
      });
    }
  };

  return (
    <Card className="card-soft max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reading Comprehension</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-lg leading-relaxed font-accessible">
            {passage}
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="grid gap-2">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswer(index)}
                className="justify-start text-left p-4 h-auto"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </CardContent>
    </Card>
  );
}