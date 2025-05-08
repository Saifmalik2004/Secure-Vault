
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "../../context/TimerContext";
import { sessions, SessionType, Session } from "../../pages/PomodoroTimer";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-background/95 p-4">
      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant="default"
          className="rounded-full text-lg font-semibold transition-all duration-300 bg-red-500 hover:bg-red-600"
        >
          Pomodoro
        </Button>
        <Button
          variant="outline"
          className="rounded-full text-lg font-semibold transition-all duration-300 border-foreground/20 hover:scale-105"
          onClick={onSwitchToStopwatch}
        >
          Stopwatch
        </Button>
      </div>

      {/* Pomodoro Tab */}
      <div className="flex flex-col items-center">
        {/* Session Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {Object.keys(sessions).map((sessionType) => (
            <Button
              key={sessionType}
              variant={currentSession.type === sessionType ? "default" : "outline"}
              className={`rounded-full transition-all duration-300 ${
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
        <div className="relative flex justify-center mb-6">
          <svg className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]" viewBox="0 0 300 300">
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
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-5xl font-semibold text-foreground dark:text-foreground"
            aria-live="polite"
          >
            {formatPomodoroTime(pomodoroTime)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            size="lg"
            className={`rounded-full transition-all duration-300 ${
              isPomodoroRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={togglePomodoro}
          >
            {isPomodoroRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-foreground/20 hover:scale-105"
            onClick={resetPomodoro}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Session Counter */}
        <div className="text-center text-muted-foreground dark:text-muted-foreground/80">
          <p>
            Cycle {Math.floor(cycleCount / 4) + 1}/4 | Completed Sessions: {completedSessions}
          </p>
        </div>
      </div>
    </div>
  );
}
