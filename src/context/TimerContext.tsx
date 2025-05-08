import { createContext, useContext, useState, useEffect } from "react";
import { Session, SessionType } from "../pages/PomodoroTimer";
import { loadFromStorage, saveToStorage } from "../lib/storage";

const TIMER_STORAGE_KEY = "timer-state";

interface TimerState {
  pomodoroTime: number;
  isPomodoroRunning: boolean;
  currentSession: Session;
  cycleCount: number;
  completedSessions: number;
  stopwatchTime: number;
  isStopwatchRunning: boolean;
  stopwatchMode: "stopwatch" | "countdown";
  countdownInput: { minutes: string; seconds: string };
  lastActiveTimestamp: number | null;
  setPomodoroTime: (time: number) => void;
  setIsPomodoroRunning: (running: boolean) => void;
  setCurrentSession: (session: Session) => void;
  setCycleCount: (count: number) => void;
  setCompletedSessions: (count: number) => void;
  setStopwatchTime: (time: number) => void;
  setIsStopwatchRunning: (running: boolean) => void;
  setStopwatchMode: (mode: "stopwatch" | "countdown") => void;
  setCountdownInput: (input: { minutes: string; seconds: string }) => void;
  setLastActiveTimestamp: (timestamp: number | null) => void;
}

const TimerContext = createContext<TimerState | undefined>(undefined);

const defaultTimerState = {
  pomodoroTime: 25 * 60,
  isPomodoroRunning: false,
  currentSession: {
    type: "pomodoro" as SessionType,
    duration: 25 * 60,
    color: "#ff4d4d",
  },
  cycleCount: 0,
  completedSessions: 0,
  stopwatchTime: 0,
  isStopwatchRunning: false,
  stopwatchMode: "stopwatch" as const,
  countdownInput: {
    minutes: "10",
    seconds: "00",
  },
  lastActiveTimestamp: null,
};

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [pomodoroTime, setPomodoroTime] = useState<number>(defaultTimerState.pomodoroTime);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(defaultTimerState.isPomodoroRunning);
  const [currentSession, setCurrentSession] = useState<Session>(defaultTimerState.currentSession);
  const [cycleCount, setCycleCount] = useState<number>(defaultTimerState.cycleCount);
  const [completedSessions, setCompletedSessions] = useState<number>(defaultTimerState.completedSessions);
  const [stopwatchTime, setStopwatchTime] = useState<number>(defaultTimerState.stopwatchTime);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(defaultTimerState.isStopwatchRunning);
  const [stopwatchMode, setStopwatchMode] = useState<"stopwatch" | "countdown">(defaultTimerState.stopwatchMode);
  const [countdownInput, setCountdownInput] = useState<{ minutes: string; seconds: string }>(defaultTimerState.countdownInput);
  const [lastActiveTimestamp, setLastActiveTimestamp] = useState<number | null>(defaultTimerState.lastActiveTimestamp);

  // Load state from localStorage
  useEffect(() => {
    const savedState = loadFromStorage(TIMER_STORAGE_KEY, null);
    
    if (savedState) {
      try {
        setPomodoroTime(savedState.pomodoroTime ?? defaultTimerState.pomodoroTime);
        setIsPomodoroRunning(savedState.isPomodoroRunning ?? defaultTimerState.isPomodoroRunning);
        setCurrentSession(savedState.currentSession ?? defaultTimerState.currentSession);
        setCycleCount(savedState.cycleCount ?? defaultTimerState.cycleCount);
        setCompletedSessions(savedState.completedSessions ?? defaultTimerState.completedSessions);
        setStopwatchTime(savedState.stopwatchTime ?? defaultTimerState.stopwatchTime);
        setIsStopwatchRunning(savedState.isStopwatchRunning ?? defaultTimerState.isStopwatchRunning);
        setStopwatchMode(savedState.stopwatchMode ?? defaultTimerState.stopwatchMode);
        setCountdownInput(savedState.countdownInput ?? defaultTimerState.countdownInput);
        setLastActiveTimestamp(savedState.lastActiveTimestamp ?? null);
      } catch (e) {
        console.error("Error parsing saved timer state:", e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      saveToStorage(TIMER_STORAGE_KEY, {
        pomodoroTime,
        isPomodoroRunning,
        currentSession,
        cycleCount,
        completedSessions,
        stopwatchTime,
        isStopwatchRunning,
        stopwatchMode,
        countdownInput,
        lastActiveTimestamp,
      });
    } catch (e) {
      console.error("Error saving timer state:", e);
    }
  }, [
    pomodoroTime,
    isPomodoroRunning,
    currentSession,
    cycleCount,
    completedSessions,
    stopwatchTime,
    isStopwatchRunning,
    stopwatchMode,
    countdownInput,
    lastActiveTimestamp,
  ]);

  // Handle page visibility and route change
  useEffect(() => {
    // Keep track of last active time to calculate elapsed time
    let lastTickTime = Date.now();
    let timerInterval: NodeJS.Timeout | null = null;

    // Function to update the timer based on elapsed time
    const updateTimers = () => {
      const now = Date.now();
      const elapsedSeconds = (now - lastTickTime) / 1000;
      lastTickTime = now;

      // Update pomodoro timer if running
      if (isPomodoroRunning) {
        setPomodoroTime((prevTime) => Math.max(0, prevTime - elapsedSeconds));
      }

      // Update stopwatch if running
      if (isStopwatchRunning) {
        if (stopwatchMode === "stopwatch") {
          setStopwatchTime((prevTime) => prevTime + elapsedSeconds * 1000);
        } else {
          setStopwatchTime((prevTime) => Math.max(0, prevTime - elapsedSeconds * 1000));
        }
      }
    };

    // Start the timer interval if any timer is running
    if (isPomodoroRunning || isStopwatchRunning) {
      lastTickTime = Date.now();
      timerInterval = setInterval(updateTimers, 1000);
    }

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      const now = Date.now();
      
      // If page becomes visible again and we have timers running
      if (!document.hidden) {
        const elapsedSeconds = (now - lastTickTime) / 1000;
        
        // Update pomodoro timer
        if (isPomodoroRunning) {
          setPomodoroTime((prevTime) => Math.max(0, prevTime - elapsedSeconds));
        }
        
        // Update stopwatch
        if (isStopwatchRunning) {
          if (stopwatchMode === "stopwatch") {
            setStopwatchTime((prevTime) => prevTime + elapsedSeconds * 1000);
          } else {
            setStopwatchTime((prevTime) => Math.max(0, prevTime - elapsedSeconds * 1000));
          }
        }
      }
      
      lastTickTime = now;
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPomodoroRunning, isStopwatchRunning, stopwatchMode, pomodoroTime, stopwatchTime]);

  return (
    <TimerContext.Provider
      value={{
        pomodoroTime,
        isPomodoroRunning,
        currentSession,
        cycleCount,
        completedSessions,
        stopwatchTime,
        isStopwatchRunning,
        stopwatchMode,
        countdownInput,
        lastActiveTimestamp,
        setPomodoroTime,
        setIsPomodoroRunning,
        setCurrentSession,
        setCycleCount,
        setCompletedSessions,
        setStopwatchTime,
        setIsStopwatchRunning,
        setStopwatchMode,
        setCountdownInput,
        setLastActiveTimestamp,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
