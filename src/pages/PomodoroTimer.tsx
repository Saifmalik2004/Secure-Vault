
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useTimer } from "../context/TimerContext";
import PomodoroTab from "../components/pomodoro/PomodoroTab";
import StopwatchTab from "../components/pomodoro/StopwatchTab";

export type SessionType = "pomodoro" | "shortBreak" | "longBreak";

export interface Session {
  type: SessionType;
  duration: number; // Duration in seconds
  color: string; // Color for timer stroke
}

export const sessions: Record<SessionType, Session> = {
  pomodoro: { type: "pomodoro", duration: 25 * 60, color: "#ff4d4d" },
  shortBreak: { type: "shortBreak", duration: 5 * 60, color: "#4ade80" },
  longBreak: { type: "longBreak", duration: 15 * 60, color: "#4ade80" },
};

interface PomodoroTimerProps {
  initialTab?: "pomodoro" | "stopwatch";
}

export default function PomodoroTimer({ initialTab = "pomodoro" }: PomodoroTimerProps) {
  const [activeTab, setActiveTab] = useState<"pomodoro" | "stopwatch">(initialTab);
  const navigate = useNavigate();

  // Handle tab switch
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <>
      {activeTab === "pomodoro" ? (
        <PomodoroTab 
          onSwitchToStopwatch={() => navigate("/pomodoro-timer/stopwatch")} 
        />
      ) : (
        <StopwatchTab 
          onSwitchToPomodoro={() => navigate("/pomodoro-timer")} 
        />
      )}
    </>
  );
}
