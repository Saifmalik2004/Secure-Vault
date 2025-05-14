import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Info } from "lucide-react";
import { useTimer } from "../../context/TimerContext";
import { sessions, SessionType, Session } from "../../pages/PomodoroTimer";
import { useToast } from "@/components/ui/use-toast";
import { PomodoroInfoDialog } from "./PomodoroInfoDialog";

interface PomodoroTabProps {
  onSwitchToStopwatch: () => void;
}

export default function PomodoroTab({ onSwitchToStopwatch }: PomodoroTabProps) {
  const {
    pomodoroTime,
    isPomodoroRunning,
    currentSession,
    cycleCount,
    completedSessions,
    setPomodoroTime,
    setIsPomodoroRunning,
    setCurrentSession,
    setCycleCount,
    setCompletedSessions
  } = useTimer();

  const { toast } = useToast();
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  // Handle session completion
  useEffect(() => {
    if (pomodoroTime <= 0 && isPomodoroRunning) {
      setIsPomodoroRunning(false);
      setCompletedSessions(completedSessions + 1);
      
      // Play notification sound
      try {
        const audio = new Audio('https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3');
        audio.play();
      } catch (err) {
        console.error("Error playing sound:", err);
      }
      
      // Show toast notification
      toast({
        title: `${currentSession.type.charAt(0).toUpperCase() + currentSession.type.slice(1)} completed!`,
        description: "Time to move to the next session",
      });
      
      // Set up next session
      if (currentSession.type === "pomodoro") {
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        
        const nextSession = newCycleCount % 4 === 0 ? sessions.longBreak : sessions.shortBreak;
        setCurrentSession(nextSession);
        setPomodoroTime(nextSession.duration);
      } else {
        setCurrentSession(sessions.pomodoro);
        setPomodoroTime(sessions.pomodoro.duration);
      }
    }
  }, [
    isPomodoroRunning, 
    pomodoroTime, 
    currentSession,
    cycleCount,
    completedSessions,
    setPomodoroTime,
    setIsPomodoroRunning,
    setCurrentSession,
    setCycleCount,
    setCompletedSessions,
    toast
  ]);

  // Format time for Pomodoro (MM:SS)
  const formatPomodoroTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate stroke dashoffset for Pomodoro SVG
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = pomodoroTime / currentSession.duration;
  const strokeDashoffset = circumference * (1 - progress);

  // Handle Pomodoro session change
  const handleSessionChange = (sessionType: SessionType) => {
    setCurrentSession(sessions[sessionType]);
    setPomodoroTime(sessions[sessionType].duration);
    setIsPomodoroRunning(false);
  };

  // Toggle Pomodoro timer
  const togglePomodoro = () => {
    setIsPomodoroRunning(!isPomodoroRunning);
  };

  // Reset Pomodoro
  const resetPomodoro = () => {
    setCurrentSession(sessions.pomodoro);
    setPomodoroTime(sessions.pomodoro.duration);
    setIsPomodoroRunning(false);
    setCycleCount(0);
    setCompletedSessions(0);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-background dark:bg-background/95 px-4 pt-0">
      <div className="relative w-full max-w-3xl">
        {/* Info Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
          onClick={() => setIsInfoDialogOpen(true)}
          aria-label="Learn about the Pomodoro Technique"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mt-4 mb-4 sm:mb-6">
          <Button
            variant="default"
            className="rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 bg-red-500 hover:bg-red-600 px-2 sm:px-3"
          >
            Pomodoro
          </Button>
          <Button
            variant="outline"
            className="rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border-foreground/20 hover:scale-105 px-2 sm:px-3"
            onClick={onSwitchToStopwatch}
          >
            Stopwatch
          </Button>
        </div>

        {/* Pomodoro Tab */}
        <div className="flex flex-col items-center">
          {/* Session Tabs */}
          <div className="flex justify-center gap-1 sm:gap-2 mb-14 sm:mb-6 flex-wrap">
            {Object.keys(sessions).map((sessionType) => (
              <Button
                key={sessionType}
                variant={currentSession.type === sessionType ? "default" : "outline"}
                className={`rounded-full transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3 min-w-fit ${
                  currentSession.type === sessionType
                    ? sessionType === "pomodoro"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                    : "border-foreground/20 hover:scale-105"
                }`}
                onClick={() => handleSessionChange(sessionType as SessionType)}
              >
                {sessionType === "pomodoro"
                  ? "Pomodoro"
                  : sessionType === "shortBreak"
                  ? "Short Break"
                  : "Long Break"}
              </Button>
            ))}
          </div>

          {/* Circular Timer */}
          <div className="relative flex justify-center mb-4 sm:mb-6">
            <svg className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[280px] md:h-[280px] lg:w-[340px] lg:h-[340px]" viewBox="0 0 300 300">
              <circle
                cx="150"
                cy="150"
                r={radius}
                fill="none"
                stroke="hsl(var(--muted) / 0.2)"
                strokeWidth="20"
              />
              <circle
                cx="150"
                cy="150"
                r={radius}
                fill="none"
                stroke={currentSession.color}
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-linear"
                transform="rotate(-90 150 150)"
              />
            </svg>
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground dark:text-foreground"
              aria-live="polite"
            >
              {formatPomodoroTime(pomodoroTime)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Button
              size="lg"
              className={`rounded-full transition-all duration-300 text-xs sm:text-base px-2 sm:px-4 ${
                isPomodoroRunning
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={togglePomodoro}
            >
              {isPomodoroRunning ? <Pause className="w-3 sm:w-5 h-3 sm:h-5" /> : <Play className="w-3 sm:w-5 h-3 sm:h-5" />}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-foreground/20 hover:scale-105 text-xs sm:text-base px-2 sm:px-4"
              onClick={resetPomodoro}
            >
              <RotateCcw className="w-3 sm:w-5 h-3 sm:h-5" />
            </Button>
          </div>

          {/* Session Counter */}
          <div className="text-center text-muted-foreground dark:text-muted-foreground/80 text-xs sm:text-base mb-0">
            <p>
              Cycle {Math.floor(cycleCount / 4) + 1}/4 | Completed Sessions: {completedSessions}
            </p>
          </div>
        </div>
      </div>

      {/* Info Dialog */}
      <PomodoroInfoDialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen} />
    </div>
  );
}