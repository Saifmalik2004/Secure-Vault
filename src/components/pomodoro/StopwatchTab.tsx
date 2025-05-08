
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { useTimer } from "../../context/TimerContext";
import { useToast } from "@/components/ui/use-toast";

interface StopwatchTabProps {
  onSwitchToPomodoro: () => void;
}

export default function StopwatchTab({ onSwitchToPomodoro }: StopwatchTabProps) {
  const {
    stopwatchTime,
    isStopwatchRunning,
    stopwatchMode,
    countdownInput,
    setStopwatchTime,
    setIsStopwatchRunning,
    setStopwatchMode,
    setCountdownInput,
    setLastActiveTimestamp,
  } = useTimer();

  const [showButtons, setShowButtons] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const { toast } = useToast();

  // Button visibility logic for stopwatch
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const hideButtons = () => {
      setShowButtons(false);
    };

    const resetTimeout = () => {
      setShowButtons(true);
      clearTimeout(timeout);
      timeout = setTimeout(hideButtons, 5000);
    };

    resetTimeout();

    const handleActivity = () => resetTimeout();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, []);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Stopwatch logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = Date.now();
    
    const updateStopwatch = () => {
      if (isStopwatchRunning) {
        const now = Date.now();
        const elapsed = now - lastTimestamp;
        lastTimestamp = now;
        
        if (stopwatchMode === "stopwatch") {
          setStopwatchTime(stopwatchTime + elapsed);
        } else {
          const newTime = Math.max(0, stopwatchTime - elapsed);
          setStopwatchTime(newTime);
        }
        
        animationFrameId = requestAnimationFrame(updateStopwatch);
      }
    };

    if (isStopwatchRunning) {
      lastTimestamp = Date.now();
      setLastActiveTimestamp(lastTimestamp);
      animationFrameId = requestAnimationFrame(updateStopwatch);
    }
    
    // Handle countdown completion
    if (stopwatchMode === "countdown" && stopwatchTime <= 0 && isStopwatchRunning) {
      setIsStopwatchRunning(false);
      toast({
        title: "Countdown completed!",
        description: "Your countdown timer has finished",
      });
      
      try {
        const audio = new Audio('https://soundbible.com/mp3/analog-watch-alarm_daniel-simion.mp3');
        audio.play();
      } catch (err) {
        console.error("Error playing sound:", err);
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    isStopwatchRunning, 
    stopwatchMode, 
    stopwatchTime, 
    setStopwatchTime, 
    setIsStopwatchRunning,
    setLastActiveTimestamp,
    toast
  ]);

  // Format time for Stopwatch (MM:SS:MS)
  const formatStopwatchTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
  };

  // Toggle Stopwatch/Countdown
  const toggleStopwatch = () => {
    setIsStopwatchRunning(!isStopwatchRunning);
  };

  // Reset Stopwatch
  const resetStopwatch = () => {
    setStopwatchTime(stopwatchMode === "countdown" ? getCountdownTime() : 0);
    setIsStopwatchRunning(false);
  };

  // Get countdown time from input
  const getCountdownTime = (): number => {
    const minutes = parseInt(countdownInput.minutes) || 0;
    const seconds = parseInt(countdownInput.seconds) || 0;
    return (minutes * 60 + seconds) * 1000;
  };

  // Handle countdown input change
  const handleCountdownInput = (field: "minutes" | "seconds", value: string) => {
    if (/^\d*$/.test(value) && value.length <= 2 && parseInt(value || "0") <= (field === "minutes" ? 99 : 59)) {
      setCountdownInput({ ...countdownInput, [field]: value });
      if (!isStopwatchRunning) {
        setStopwatchTime(getCountdownTime());
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(err => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white"
      onClick={toggleFullscreen}
    >
      {/* Mode Toggle */}
      <div
        className={`flex justify-center gap-4 mb-6 transition-opacity duration-300 ${
          showButtons ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Button
          variant={stopwatchMode === "stopwatch" ? "default" : "outline"}
          className={`rounded-full transition-all duration-300 ${
            stopwatchMode === "stopwatch"
              ? "bg-green-500 hover:bg-green-600"
              : "border-white/20 hover:scale-105 text-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setStopwatchMode("stopwatch");
            setStopwatchTime(0);
            setIsStopwatchRunning(false);
          }}
        >
          Stopwatch
        </Button>
        <Button
          variant={stopwatchMode === "countdown" ? "default" : "outline"}
          className={`rounded-full transition-all duration-300 ${
            stopwatchMode === "countdown"
              ? "bg-green-500 hover:bg-green-600"
              : "border-white/20 hover:scale-105 text-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setStopwatchMode("countdown");
            setStopwatchTime(getCountdownTime());
            setIsStopwatchRunning(false);
          }}
        >
          Countdown
        </Button>
      </div>

      {/* Countdown Input */}
      {stopwatchMode === "countdown" && (
        <div
          className={`flex gap-2 mb-6 transition-opacity duration-300 ${
            showButtons ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            type="text"
            placeholder="MM"
            value={countdownInput.minutes}
            onChange={(e) => handleCountdownInput("minutes", e.target.value)}
            className="w-16 text-center text-white"
          />
          <span className="text-2xl">:</span>
          <Input
            type="text"
            placeholder="SS"
            value={countdownInput.seconds}
            onChange={(e) => handleCountdownInput("seconds", e.target.value)}
            className="w-16 text-center text-white"
          />
        </div>
      )}

      {/* Time Display */}
      <div className="text-9xl sm:text-[18rem] font-bold mb-6 font-mono" aria-live="polite">
        {formatStopwatchTime(stopwatchTime)}
      </div>

      {/* Controls */}
      <div
        className={`flex flex-col items-center gap-4 transition-opacity duration-300 ${
          showButtons ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className={`rounded-full transition-all duration-300 ${
              isStopwatchRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleStopwatch();
            }}
          >
            {isStopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 hover:scale-105 text-white"
            onClick={(e) => {
              e.stopPropagation();
              resetStopwatch();
            }}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
        <Button
          size="lg"
          className="rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onSwitchToPomodoro();
          }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Pomodoro
        </Button>
      </div>
    </div>
  );
}
