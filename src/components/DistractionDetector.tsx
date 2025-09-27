import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Pause, 
  Square, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  Phone,
  Users
} from "lucide-react";
import { DistractionEvent, SessionData } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface DistractionDetectorProps {
  onSessionStart: (session: SessionData) => void;
  onSessionEnd: (session: SessionData) => void;
  currentSession: SessionData | null;
}

const DistractionDetector = ({ onSessionStart, onSessionEnd, currentSession }: DistractionDetectorProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [focusScore, setFocusScore] = useState(100);
  const [currentDistraction, setCurrentDistraction] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [distractions, setDistractions] = useState<DistractionEvent[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const sessionStartRef = useRef<number>(0);
  
  const { toast } = useToast();

  // Mock ML detection function (in real implementation, this would use @huggingface/transformers)
  const detectDistraction = useCallback((imageData: ImageData): DistractionEvent | null => {
    // Simulate ML model analysis
    const random = Math.random();
    
    if (random < 0.1) { // 10% chance of detecting distraction
      const distractionTypes: DistractionEvent['type'][] = [
        'looking_away', 'phone_detected', 'multiple_faces', 'no_face', 'eyes_closed'
      ];
      
      const type = distractionTypes[Math.floor(Math.random() * distractionTypes.length)];
      const confidence = 0.7 + Math.random() * 0.3; // 70-100% confidence
      
      return {
        timestamp: Date.now(),
        type,
        confidence,
        duration: 1000 + Math.random() * 3000 // 1-4 seconds
      };
    }
    
    return null;
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraError(null);
      }
    } catch (error) {
      setCameraError("Camera access denied. Please allow camera permissions.");
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const distraction = detectDistraction(imageData);
    
    if (distraction) {
      setCurrentDistraction(distraction.type);
      setDistractions(prev => [...prev, distraction]);
      setFocusScore(prev => Math.max(10, prev - 5));
      
      toast({
        title: "Distraction Detected",
        description: getDistractionMessage(distraction.type),
        variant: "destructive",
      });
      
      // Clear distraction after duration
      setTimeout(() => {
        setCurrentDistraction(null);
      }, distraction.duration);
    } else {
      // Gradually improve focus score when focused
      setFocusScore(prev => Math.min(100, prev + 0.5));
    }
  }, [detectDistraction, toast]);

  const getDistractionMessage = (type: DistractionEvent['type']): string => {
    switch (type) {
      case 'looking_away': return "Please look at the screen";
      case 'phone_detected': return "Phone detected - please put it away";
      case 'multiple_faces': return "Multiple people detected";
      case 'no_face': return "No face detected";
      case 'eyes_closed': return "Eyes closed detected";
      default: return "Stay focused!";
    }
  };

  const getDistractionIcon = (type: DistractionEvent['type']) => {
    switch (type) {
      case 'looking_away': return <EyeOff className="w-4 h-4" />;
      case 'phone_detected': return <Phone className="w-4 h-4" />;
      case 'multiple_faces': return <Users className="w-4 h-4" />;
      case 'no_face': return <EyeOff className="w-4 h-4" />;
      case 'eyes_closed': return <EyeOff className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const startSession = async () => {
    await startCamera();
    const sessionId = `session_${Date.now()}`;
    const startTime = Date.now();
    sessionStartRef.current = startTime;
    
    const session: SessionData = {
      sessionId,
      startTime,
      distractions: [],
      focusScore: 100,
      totalDuration: 0
    };
    
    onSessionStart(session);
    setIsActive(true);
    setIsPaused(false);
    setSessionTime(0);
    setDistractions([]);
    setFocusScore(100);
    setCurrentDistraction(null);
    
    // Start detection loop
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        captureFrame();
        setSessionTime(Date.now() - sessionStartRef.current);
      }
    }, 1000);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const stopSession = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    stopCamera();
    setIsActive(false);
    setIsPaused(false);
    
    if (currentSession) {
      const endTime = Date.now();
      const finalSession: SessionData = {
        ...currentSession,
        endTime,
        distractions,
        focusScore,
        totalDuration: endTime - currentSession.startTime
      };
      
      onSessionEnd(finalSession);
    }
    
    toast({
      title: "Session Completed",
      description: `Focus score: ${focusScore}% | Duration: ${Math.round(sessionTime / 1000)}s`,
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopCamera();
    };
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Video Feed */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Live Detection
            </CardTitle>
            <CardDescription>
              AI-powered real-time distraction monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full rounded-lg bg-muted"
                style={{ maxHeight: '400px' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay indicators */}
              {isActive && (
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={isPaused ? "secondary" : "default"}>
                    {isPaused ? "PAUSED" : "LIVE"}
                  </Badge>
                  {currentDistraction && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      {getDistractionIcon(currentDistraction as DistractionEvent['type'])}
                      DISTRACTED
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {cameraError && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
            )}
            
            {/* Controls */}
            <div className="flex gap-2 mt-4">
              {!isActive ? (
                <Button onClick={startSession} className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Start Detection
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={pauseSession} 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button 
                    onClick={stopSession} 
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Square className="w-4 h-4" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Focus Score</span>
                  <span className="text-2xl font-bold text-primary">{Math.round(focusScore)}%</span>
                </div>
                <Progress value={focusScore} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{formatTime(sessionTime)}</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{distractions.length}</div>
                  <div className="text-sm text-muted-foreground">Distractions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              {!isActive ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-5 h-5" />
                  <span>Ready to start monitoring</span>
                </div>
              ) : isPaused ? (
                <div className="flex items-center gap-2 text-yellow-500">
                  <Pause className="w-5 h-5" />
                  <span>Session paused</span>
                </div>
              ) : currentDistraction ? (
                <div className="flex items-center gap-2 text-red-500">
                  {getDistractionIcon(currentDistraction as DistractionEvent['type'])}
                  <span>{getDistractionMessage(currentDistraction as DistractionEvent['type'])}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-5 h-5" />
                  <span>Focused and attentive</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Distractions */}
          {distractions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Distractions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {distractions.slice(-5).reverse().map((distraction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        {getDistractionIcon(distraction.type)}
                        <span className="text-sm">{getDistractionMessage(distraction.type)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(distraction.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistractionDetector;