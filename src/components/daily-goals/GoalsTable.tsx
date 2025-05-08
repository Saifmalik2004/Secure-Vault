
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Goal, GoalCompletion } from "@/pages/DailyGoals";
import { Edit, Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface GoalsTableProps {
  goals: Goal[];
  completions: GoalCompletion[];
  onToggleCompletion: (goalId: string, date: string, isCompleted: boolean) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export function GoalsTable({ goals, completions, onToggleCompletion, onEdit, onDelete }: GoalsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const getDatesForCurrentWeek = () => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const weekDates = getDatesForCurrentWeek();
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const formatDayNumber = (date: Date) => {
    return date.getDate();
  };
  
  const isCompleted = (goalId: string, date: string) => {
    return completions.some(c => c.goal_id === goalId && c.completed_date === date);
  };

  const formatTime = (time: string | null) => {
    if (!time || time === "") {
      return "-";
    }

    try {
      // Handle different time formats
      // Case 1: Standard HH:MM format (e.g., "08:30")
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }
      
      // Case 2: PostgreSQL time format with seconds (e.g., "08:30:00")
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      }

      // Case 3: Try parsing with date-fns as a fallback
      const today = new Date();
      const timeDate = new Date(today.toDateString() + ' ' + time);
      
      if (!isNaN(timeDate.getTime())) {
        return format(timeDate, 'h:mm a');
      }
      
      console.warn(`Time format not recognized: ${time}`);
      return time;
    } catch (error) {
      console.error(`Error formatting time: ${time}`, error);
      return "-";
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold">No goals found</h3>
        <p className="text-muted-foreground">
          Add your first daily goal by clicking the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Task</TableHead>
            <TableHead className="w-[150px]">Time</TableHead>
            {weekDates.map((date) => (
              <TableHead 
                key={date.toISOString()} 
                className={`text-center ${isToday(date) ? 'bg-muted/50' : ''}`}
              >
                <div>{formatDayName(date)}</div>
                <div className="text-sm font-normal">{formatDayNumber(date)}</div>
              </TableHead>
            ))}
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <TableRow key={goal.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>{goal.icon}</span>
                  <span>{goal.task}</span>
                </div>
              </TableCell>
              <TableCell>
                {goal.start_time || goal.end_time 
                  ? `${formatTime(goal.start_time)} - ${formatTime(goal.end_time)}`
                  : '-'}
              </TableCell>
              {weekDates.map((date) => {
                const dateStr = formatDate(date);
                const dayOfWeek = date.getDay();
                const shouldShow = goal.weekday?.includes(dayOfWeek);
                const completed = isCompleted(goal.id, dateStr);
                
                return (
                  <TableCell key={dateStr} className="text-center">
                    {shouldShow ? (
                      <Checkbox
                        checked={completed}
                        onCheckedChange={() => onToggleCompletion(goal.id, dateStr, completed)}
                        className="mx-auto"
                      />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                );
              })}
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(goal)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setDeleteId(goal.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this goal and all its tracked data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteId) {
                onDelete(deleteId);
                setDeleteId(null);
              }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
