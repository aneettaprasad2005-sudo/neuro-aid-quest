import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  BookOpen,
  FileText,
  Zap 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReadingTool() {
  const [text, setText] = useState(`Welcome to NeuroAid Lite! This reading tool uses advanced text-to-speech technology with synchronized word highlighting. 

Research shows that when students with dyslexia hear words while seeing them highlighted, it significantly improves reading comprehension and fluency. The synchronized highlighting helps develop phonological awareness - the understanding of how sounds correspond to written letters.

Try typing your own text below, or use this sample text to experience how the tool works. Each word will be highlighted in real-time as it's spoken, creating a multi-sensory learning experience that supports different learning styles.

Visual stress, which affects many people with dyslexia, is reduced through our carefully chosen color palette and dyslexia-friendly fonts. The high-contrast mode further enhances readability by reducing glare and improving text clarity.`);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [words, setWords] = useState<string[]>([]);
  const [speechRate, setSpeechRate] = useState(0.8);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordsRef = useRef<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const textWords = text.split(/\s+/).filter(word => word.length > 0);
    setWords(textWords);
    wordsRef.current = textWords;
  }, [text]);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const startReading = () => {
    if (!text.trim()) {
      toast({
        title: "No text to read",
        description: "Please enter some text first.",
        variant: "destructive",
      });
      return;
    }

    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    // Stop any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;

    let wordIndex = 0;

    // Handle word boundary events for synchronized highlighting
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(wordIndex);
        wordIndex++;
      }
    };

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentWordIndex(0);
      toast({
        title: "Reading started",
        description: "Watch the words highlight as they're spoken!",
      });
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      toast({
        title: "Reading complete",
        description: "Great job! Try reading another text.",
      });
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
      toast({
        title: "Reading error",
        description: "There was an issue with text-to-speech. Please try again.",
        variant: "destructive",
      });
    };

    speechSynthesis.speak(utterance);
  };

  const pauseReading = () => {
    speechSynthesis.pause();
    setIsPaused(true);
    toast({
      title: "Reading paused",
      description: "Click resume to continue where you left off.",
    });
  };

  const resumeReading = () => {
    speechSynthesis.resume();
    setIsPaused(false);
    toast({
      title: "Reading resumed",
      description: "Continuing from where we left off.",
    });
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    toast({
      title: "Reading stopped",
      description: "Ready to start reading again.",
    });
  };

  const renderTextWithHighlighting = () => {
    return words.map((word, index) => (
      <span
        key={index}
        className={`inline-block mr-2 mb-1 px-2 py-1 rounded transition-all duration-200 ${
          index === currentWordIndex
            ? 'highlight-active font-bold'
            : index < currentWordIndex
            ? 'highlight-reading'
            : ''
        }`}
      >
        {word}
      </span>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold font-accessible">Reading Tool</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience synchronized text-to-speech with real-time word highlighting designed for dyslexia support.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Text Input Section */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Your Text</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste your text here to read aloud..."
              className="min-h-[200px] text-base leading-relaxed font-accessible resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {words.length} words
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">Speed:</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm w-8">{speechRate}x</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reading Display Section */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5" />
              <span>Reading Display</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[200px] p-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
              {words.length > 0 ? (
                <div className="text-lg leading-relaxed font-accessible">
                  {renderTextWithHighlighting()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2" />
                    <p>Words will appear here with synchronized highlighting</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              {!isPlaying ? (
                <Button 
                  onClick={startReading} 
                  className="bg-gradient-primary"
                  disabled={!text.trim()}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Reading
                </Button>
              ) : (
                <>
                  {!isPaused ? (
                    <Button 
                      onClick={pauseReading} 
                      variant="secondary"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      onClick={resumeReading} 
                      className="bg-gradient-success"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  
                  <Button 
                    onClick={stopReading} 
                    variant="destructive"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Info */}
      <Card className="card-soft bg-gradient-to-r from-primary/5 to-success/5">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4 font-accessible">How This Helps With Dyslexia</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Synchronized Highlighting</h4>
              <p className="text-sm text-muted-foreground">
                Real-time word highlighting helps connect spoken sounds to written words, improving phonological awareness.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-success">Multi-Sensory Learning</h4>
              <p className="text-sm text-muted-foreground">
                Combining visual and auditory input creates multiple pathways to comprehension and retention.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-warning">Reading Fluency</h4>
              <p className="text-sm text-muted-foreground">
                Following along with natural speech patterns helps develop rhythm and flow in reading.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}