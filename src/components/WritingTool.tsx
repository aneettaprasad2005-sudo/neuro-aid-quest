import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Volume2, 
  FileText,
  CheckCircle,
  Lightbulb,
  Play,
  Pause,
  Square 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WritingTool() {
  const [writingText, setWritingText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const { toast } = useToast();

  const handleTextChange = (text: string) => {
    setWritingText(text);
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const readTextAloud = () => {
    if (!writingText.trim()) {
      toast({
        title: "No text to read",
        description: "Please write something first.",
        variant: "destructive",
      });
      return;
    }

    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(writingText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsReading(true);
      toast({
        title: "Reading your writing",
        description: "Listen carefully to catch any errors!",
      });
    };

    utterance.onend = () => {
      setIsReading(false);
      toast({
        title: "Reading complete",
        description: "How did your writing sound? Make any needed changes!",
      });
    };

    utterance.onerror = () => {
      setIsReading(false);
      toast({
        title: "Reading error",
        description: "There was an issue with text-to-speech. Please try again.",
        variant: "destructive",
      });
    };

    speechSynthesis.speak(utterance);
  };

  const clearText = () => {
    setWritingText("");
    setWordCount(0);
    speechSynthesis.cancel();
    setIsReading(false);
  };

  const writingPrompts = [
    "Describe your favorite place and why it's special to you.",
    "Write about a time when you overcame a challenge.",
    "If you could have any superpower, what would it be and why?",
    "Tell the story of your perfect day from start to finish.",
    "Write about someone who inspires you and explain why."
  ];

  const usePrompt = (prompt: string) => {
    setWritingText(prompt + "\n\n");
    setWordCount(prompt.split(/\s+/).length);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
            <PenTool className="w-6 h-6 text-success-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-accessible">Writing Assistant</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Write freely and use text-to-speech to proofread your work - a powerful tool for catching errors you might miss when reading silently.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Writing Area */}
        <Card className="card-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Your Writing Space</span>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-sm">
                  {wordCount} words
                </Badge>
                {wordCount > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {Math.ceil(wordCount / 5)} minutes to read
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={writingText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Start writing your thoughts here... Remember, you can listen to your text to catch errors and improve your writing!"
              className="min-h-[400px] text-base leading-relaxed font-accessible resize-none"
            />
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={readTextAloud}
                className={isReading ? "bg-gradient-warm" : "bg-gradient-success"}
                disabled={!writingText.trim()}
              >
                {isReading ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Reading
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Read My Writing
                  </>
                )}
              </Button>
              
              {writingText.trim() && (
                <Button 
                  variant="outline"
                  onClick={clearText}
                >
                  Clear Text
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Writing Prompts & Tips */}
        <div className="space-y-6">
          {/* Writing Prompts */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>Writing Prompts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {writingPrompts.map((prompt, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prompt}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => usePrompt(prompt)}
                    className="w-full"
                  >
                    Use This Prompt
                  </Button>
                  {index < writingPrompts.length - 1 && <div className="border-b border-border my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Writing Tips */}
          <Card className="card-soft bg-gradient-to-br from-primary/5 to-success/5">
            <CardHeader>
              <CardTitle className="text-lg">Writing Tips for Better Proofreading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-semibold text-primary text-sm">Listen for Flow</h4>
                  <p className="text-sm text-muted-foreground">
                    When you hear your writing read aloud, notice if sentences flow naturally or sound choppy.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold text-success text-sm">Catch Missing Words</h4>
                  <p className="text-sm text-muted-foreground">
                    Your ears often catch missing words that your eyes skip over when reading silently.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold text-warning text-sm">Check Punctuation</h4>
                  <p className="text-sm text-muted-foreground">
                    Listen for places where the speech pauses - these often need commas or periods.
                  </p>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-semibold text-accent-foreground text-sm">Trust Your Ears</h4>
                  <p className="text-sm text-muted-foreground">
                    If something sounds wrong when read aloud, it probably needs to be revised.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Info */}
      <Card className="card-soft bg-gradient-to-r from-success/5 to-primary/5">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 font-accessible">Why Text-to-Speech Helps With Writing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-success">Auditory Proofreading</h4>
              <p className="text-sm text-muted-foreground">
                Hearing your text read aloud engages different neural pathways, helping you catch errors you might miss when reading silently.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Rhythm and Flow</h4>
              <p className="text-sm text-muted-foreground">
                Listening to your writing helps you identify awkward sentences and improve the natural rhythm of your prose.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-warning">Confidence Building</h4>
              <p className="text-sm text-muted-foreground">
                Hearing your own words spoken back builds confidence and helps you appreciate the quality of your writing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}