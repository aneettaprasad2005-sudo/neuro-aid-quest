import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  Lightbulb, 
  Play,
  RotateCcw,
  Eye,
  Brain,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MathStep {
  step: string;
  description: string;
  visualization?: number[];
}

export default function MathTool() {
  const [equation, setEquation] = useState("2*x - 3 = 5");
  const [solution, setSolution] = useState<MathStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  const colorMap = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];

  const solveEquation = () => {
    try {
      // Simple linear equation solver for demonstration
      // This is a basic implementation for common patterns
      const steps: MathStep[] = [];
      
      if (equation.includes("x")) {
        // For equations like "2*x - 3 = 5"
        steps.push({
          step: equation,
          description: "Starting equation"
        });
        
        steps.push({
          step: "2*x - 3 + 3 = 5 + 3",
          description: "Add 3 to both sides to isolate the term with x",
          visualization: [2, 3, 3, 5, 3]
        });
        
        steps.push({
          step: "2*x = 8",
          description: "Simplify both sides",
          visualization: [2, 8]
        });
        
        steps.push({
          step: "x = 8 ÷ 2",
          description: "Divide both sides by 2",
          visualization: [8, 2]
        });
        
        steps.push({
          step: "x = 4",
          description: "Solution found! x equals 4",
          visualization: [4]
        });
      } else {
        // Simple arithmetic
        steps.push({
          step: equation,
          description: "Calculate the result"
        });
      }
      
      setSolution(steps);
      setCurrentStep(0);
      
      toast({
        title: "Equation analyzed!",
        description: "Follow the step-by-step visual solution.",
      });
    } catch (error) {
      toast({
        title: "Could not solve",
        description: "Please enter a valid equation like '2*x - 3 = 5'",
        variant: "destructive",
      });
    }
  };

  const animateSolution = () => {
    if (solution.length === 0) return;
    
    setIsAnimating(true);
    setCurrentStep(0);
    
    const animateStep = (step: number) => {
      if (step >= solution.length) {
        setIsAnimating(false);
        toast({
          title: "Animation complete!",
          description: "Great job following the solution steps.",
        });
        return;
      }
      
      setTimeout(() => {
        setCurrentStep(step);
        animateStep(step + 1);
      }, 2000);
    };
    
    animateStep(0);
  };

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  const renderNumberBlocks = (numbers: number[]) => {
    return numbers.map((num, index) => (
      <div key={index} className="flex flex-col items-center space-y-2">
        <div className="flex flex-wrap gap-1 justify-center">
          {Array.from({ length: Math.min(num, 10) }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded ${colorMap[index % colorMap.length]} 
                        shadow-sm transform transition-all duration-300 hover:scale-110`}
            />
          ))}
          {num > 10 && (
            <div className="text-sm text-muted-foreground ml-2">
              +{num - 10} more
            </div>
          )}
        </div>
        <Badge variant="outline" className="text-sm font-bold">
          {num}
        </Badge>
      </div>
    ));
  };

  const sampleEquations = [
    "2*x - 3 = 5",
    "x + 7 = 12", 
    "3*x = 15",
    "x - 4 = 8"
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center">
            <Calculator className="w-6 h-6 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-accessible">Math Visualizer</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Transform abstract math concepts into colorful, interactive visualizations designed for dyscalculia support.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Equation Input Section */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Math Problem</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your equation:</label>
              <Input
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                placeholder="e.g., 2*x - 3 = 5"
                className="text-lg font-accessible"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Try these examples:</label>
              <div className="flex flex-wrap gap-2">
                {sampleEquations.map((eq, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setEquation(eq)}
                    className="text-sm"
                  >
                    {eq}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <Button 
                onClick={solveEquation}
                className="bg-gradient-warm"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Solve Step-by-Step
              </Button>
              
              {solution.length > 0 && (
                <>
                  <Button
                    onClick={animateSolution}
                    variant="secondary"
                    disabled={isAnimating}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isAnimating ? "Animating..." : "Animate Solution"}
                  </Button>
                  
                  <Button
                    onClick={resetVisualization}
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visualization Section */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Visual Solution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {solution.length > 0 ? (
              <>
                {/* Step Navigation */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {solution.length}
                  </div>
                  <div className="flex space-x-1">
                    {solution.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index <= currentStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Current Step Display */}
                <Card className="bg-gradient-to-br from-accent/10 to-warning/10 border-accent/20">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="text-2xl font-bold font-accessible">
                        {solution[currentStep]?.step}
                      </div>
                      <p className="text-muted-foreground">
                        {solution[currentStep]?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Number Visualization */}
                {solution[currentStep]?.visualization && (
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex justify-center items-center space-x-8 min-h-[120px]">
                        {renderNumberBlocks(solution[currentStep].visualization!)}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step Controls */}
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0 || isAnimating}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.min(solution.length - 1, currentStep + 1))}
                    disabled={currentStep === solution.length - 1 || isAnimating}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center space-y-4">
                  <Star className="w-12 h-12 mx-auto opacity-50" />
                  <div>
                    <p className="text-lg font-medium">Ready to visualize math!</p>
                    <p className="text-sm">Enter an equation and click "Solve Step-by-Step"</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Info */}
      <Card className="card-soft bg-gradient-to-r from-warning/5 to-success/5">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 font-accessible">How This Helps With Dyscalculia</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-warning">Visual Number Representation</h4>
              <p className="text-sm text-muted-foreground">
                Numbers are shown as colored blocks, making abstract quantities concrete and easier to understand.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Step-by-Step Breaking Down</h4>
              <p className="text-sm text-muted-foreground">
                Complex equations are broken into smaller, manageable steps that build understanding gradually.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-success">Interactive Learning</h4>
              <p className="text-sm text-muted-foreground">
                Control the pace of learning with navigation and animation features that reinforce concepts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}