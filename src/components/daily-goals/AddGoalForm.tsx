import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Goal } from "@/pages/DailyGoals";
import { Plus } from "lucide-react";
import { parse } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const WEEKDAYS = [
  { id: 0, label: "Sun" },
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const AM_PM = ["AM", "PM"];

interface AddGoalFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddGoal: (goal: { task: string; icon: string | null; weekday: number[]; start_time: string | null; end_time: string | null }) => void;
  onUpdateGoal: (goal: { task: string; icon: string | null; weekday: number[]; start_time: string | null; end_time: string | null }) => void;
  editGoal: Goal | null;
}

export function AddGoalForm({ 
  open, 
  setOpen, 
  onAddGoal, 
  onUpdateGoal,
  editGoal 
}: AddGoalFormProps) {
  const [task, setTask] = useState("");
  const [icon, setIcon] = useState<string | null>("📝");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [startHour, setStartHour] = useState<string | null>(null);
  const [startMinute, setStartMinute] = useState<string | null>(null);
  const [startAmPm, setStartAmPm] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [endMinute, setEndMinute] = useState<string | null>(null);
  const [endAmPm, setEndAmPm] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && editGoal) {
      setTask(editGoal.task);
      setIcon(editGoal.icon);
      setSelectedDays(editGoal.weekday || []);
      if (editGoal.start_time) {
        const [hour, minute] = editGoal.start_time.split(":");
        const hourNum = parseInt(hour);
        const amPm = hourNum >= 12 ? "PM" : "AM";
        const displayHour = hourNum > 12 ? (hourNum - 12).toString() : hourNum === 0 ? "12" : hourNum.toString();
        setStartHour(displayHour);
        setStartMinute(minute);
        setStartAmPm(amPm);
      } else {
        setStartHour(null);
        setStartMinute(null);
        setStartAmPm(null);
      }
      if (editGoal.end_time) {
        const [hour, minute] = editGoal.end_time.split(":");
        const hourNum = parseInt(hour);
        const amPm = hourNum >= 12 ? "PM" : "AM";
        const displayHour = hourNum > 12 ? (hourNum - 12).toString() : hourNum === 0 ? "12" : hourNum.toString();
        setEndHour(displayHour);
        setEndMinute(minute);
        setEndAmPm(amPm);
      } else {
        setEndHour(null);
        setEndMinute(null);
        setEndAmPm(null);
      }
    } else if (open) {
      setTask("");
      setIcon("📝");
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
      setStartHour(null);
      setStartMinute(null);
      setStartAmPm(null);
      setEndHour(null);
      setEndMinute(null);
      setEndAmPm(null);
    }
  }, [open, editGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startTime = startHour && startMinute && startAmPm
      ? (() => {
          let hourNum = parseInt(startHour);
          if (startAmPm === "PM" && hourNum !== 12) hourNum += 12;
          if (startAmPm === "AM" && hourNum === 12) hourNum = 0;
          return `${hourNum.toString().padStart(2, "0")}:${startMinute}`;
        })()
      : null;
    
    const endTime = endHour && endMinute && endAmPm
      ? (() => {
          let hourNum = parseInt(endHour);
          if (endAmPm === "PM" && hourNum !== 12) hourNum += 12;
          if (endAmPm === "AM" && hourNum === 12) hourNum = 0;
          return `${hourNum.toString().padStart(2, "0")}:${endMinute}`;
        })()
      : null;
    
    // Validate times
    if (startTime && !/^[0-2][0-9]:[0-5][0-9]$/.test(startTime)) {
      toast({
        title: "Invalid start time",
        description: "Please select a valid start time",
        variant: "destructive",
      });
      return;
    }
    if (endTime && !/^[0-2][0-9]:[0-5][0-9]$/.test(endTime)) {
      toast({
        title: "Invalid end time",
        description: "Please select a valid end time",
        variant: "destructive",
      });
      return;
    }
    
    // Validate time range
    if (startTime && endTime) {
      const startDate = parse(startTime, "HH:mm", new Date());
      const endDate = parse(endTime, "HH:mm", new Date());
      if (endDate <= startDate) {
        toast({
          title: "Invalid time range",
          description: "End time must be after start time",
          variant: "destructive",
        });
        return;
      }
    }
    
    const goalData = { 
      task, 
      icon, 
      weekday: selectedDays,
      start_time: startTime,
      end_time: endTime
    };
    
    if (editGoal) {
      onUpdateGoal(goalData);
    } else {
      onAddGoal(goalData);
    }
    
    setOpen(false);
  };

  const clearTimes = () => {
    setStartHour(null);
    setStartMinute(null);
    setStartAmPm(null);
    setEndHour(null);
    setEndMinute(null);
    setEndAmPm(null);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId) 
        : [...prev, dayId]
    );
  };

  const EMOJI_OPTIONS = ["📝", "✅", "🏆", "📚", "💪", "🧘", "🏃", "🧠", "❤️", "🍎", "💧", "💤"];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setTask("");
        setIcon("📝");
        setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
        setStartHour(null);
        setStartMinute(null);
        setStartAmPm(null);
        setEndHour(null);
        setEndMinute(null);
        setEndAmPm(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/90 transition-colors rounded-full px-4 py-2 text-white">
          <Plus size={16} />
          <span>Add Goal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-full bg-background dark:bg-background rounded-md border dark:border-gray-700 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-foreground dark:text-foreground">
            {editGoal ? "Edit Goal" : "Add New Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="task" className="text-sm font-medium text-foreground dark:text-foreground">Task</Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task"
              required
              className="w-full rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground dark:text-foreground">Icon</Label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <Button
                  key={emoji}
                  type="button"
                  variant={icon === emoji ? "default" : "outline"}
                  className={`h-10 w-10 p-0 rounded-full transition-transform hover:scale-105 ${
                    icon === emoji 
                      ? "bg-primary text-white dark:bg-primary/80 dark:text-white" 
                      : "border dark:border-gray-700 text-foreground dark:text-foreground"
                  }`}
                  onClick={() => setIcon(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground dark:text-foreground">Days of the Week</Label>
            <div className="flex flex-wrap gap-3">
              {WEEKDAYS.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day.id}`} 
                    checked={selectedDays.includes(day.id)}
                    onCheckedChange={() => toggleDay(day.id)}
                    className="rounded border dark:border-gray-700 text-primary dark:text-primary/80 focus:ring-primary dark:focus:ring-primary/50"
                  />
                  <label
                    htmlFor={`day-${day.id}`}
                    className="text-sm font-medium text-foreground dark:text-foreground"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground dark:text-foreground">Start Time</Label>
            <div className="flex gap-2">
              <Select value={startHour || ""} onValueChange={setStartHour}>
                <SelectTrigger className="w-1/3 rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-background dark:bg-gray-800 text-foreground dark:text-foreground">
                  {HOURS.map((hour) => (
                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={startMinute || ""} onValueChange={setStartMinute}>
                <SelectTrigger className="w-1/3 rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-background dark:bg-gray-800 text-foreground dark:text-foreground">
                  {MINUTES.map((minute) => (
                    <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={startAmPm || ""} onValueChange={setStartAmPm}>
                <SelectTrigger className="w-1/3 rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-foreground">
                  {AM_PM.map((ampm) => (
                    <SelectItem key={ampm} value={ampm}>{ampm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground dark:text-foreground">End Time</Label>
            <div className="flex gap-2">
              <Select value={endHour || ""} onValueChange={setEndHour}>
                <SelectTrigger className="w-1/3 rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-background dark:bg-gray-800 text-foreground dark:text-foreground">
                  {HOURS.map((hour) => (
                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={endMinute || ""} onValueChange={setEndMinute}>
                <SelectTrigger className="w-1/3 rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-background dark:bg-gray-800 text-foreground dark:text-foreground">
                  {MINUTES.map((minute) => (
                    <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={endAmPm || ""} onValueChange={setEndAmPm}>
                <SelectTrigger className="w-1/3 rounded-md border dark:border-gray-700 bg-background dark:bg-gray-800 text-foreground dark:text-foreground focus:ring-primary dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary/50">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-gray-800 text-foreground dark:text-foreground">
                  {AM_PM.map((ampm) => (
                    <SelectItem key={ampm} value={ampm}>{ampm}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={clearTimes}
            className="mt-2 rounded-md border dark:border-gray-700 text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-gray-700 transition-colors"
          >
            Clear Times
          </Button>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="rounded-md border dark:border-gray-700 text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="rounded-md bg-primary hover:bg-primary/90 dark:bg-primary/80 dark:hover:bg-primary/90 text-white transition-colors"
            >
              {editGoal ? "Update Goal" : "Save Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}