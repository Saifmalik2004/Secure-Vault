
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal, GoalCompletion, GoalStreak } from "@/pages/DailyGoals";

interface GoalsSummaryProps {
  streak: GoalStreak | null;
  goals: Goal[];
  completions: GoalCompletion[];
}

export function GoalsSummary({ streak, goals, completions }: GoalsSummaryProps) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Count completions for today
  const todayCompletions = completions.filter(c => c.completed_date === today);
  
  // Find goals that apply to today's weekday
  const dayOfWeek = new Date().getDay(); // 0-6, starting with Sunday
  const todayGoals = goals.filter(goal => goal.weekday?.includes(dayOfWeek));
  
  // Calculate completion percentage for today
  const completionPercentage = todayGoals.length > 0 
    ? Math.round((todayCompletions.length / todayGoals.length) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak?.current_streak || 0} days</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak?.longest_streak || 0} days</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionPercentage}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {todayCompletions.length}/{todayGoals.length} tasks completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
