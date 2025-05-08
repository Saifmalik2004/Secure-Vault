import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { GoalsTable } from "@/components/daily-goals/GoalsTable";
import { AddGoalForm } from "@/components/daily-goals/AddGoalForm";
import { GoalsSummary } from "@/components/daily-goals/GoalsSummary";
import { Loader2 } from "lucide-react";

export interface Goal {
  id: string;
  task: string;
  icon: string | null;
  weekday: number[];
  start_time: string | null; // Format: HH:mm
  end_time: string | null;   // Format: HH:mm
  created_at: string;
  updated_at: string;
}

export interface GoalStreak {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export interface GoalCompletion {
  goal_id: string;
  completed_date: string;
}

export default function DailyGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [completions, setCompletions] = useState<GoalCompletion[]>([]);
  const [streak, setStreak] = useState<GoalStreak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }

        const userId = session.session.user.id;

        // Fetch goals
        const { data: goalsData, error: goalsError } = await supabase
          .from('daily_goals')
          .select('*')
          .order('created_at', { ascending: false });

        if (goalsError) throw goalsError;
        
        // Fetch completions for the current week
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        const { data: completionsData, error: completionsError } = await supabase
          .from('daily_goal_completions')
          .select('*')
          .gte('completed_date', startOfWeek.toISOString().split('T')[0])
          .eq('user_id', userId);

        if (completionsError) throw completionsError;
        
        // Fetch streak data
        const { data: streakData, error: streakError } = await supabase
          .from('goal_streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (streakError) throw streakError;
        
        setGoals(goalsData || []);
        setCompletions(completionsData || []);
        setStreak(streakData || {
          current_streak: 0,
          longest_streak: 0,
          last_completed_date: null
        });
      } catch (error) {
        console.error("Error loading goals data:", error);
        toast({
          title: "Error",
          description: "Failed to load daily goals",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAddGoal = async (newGoal: { task: string; icon: string | null; weekday: number[]; start_time: string | null; end_time: string | null }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to add goals",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('daily_goals')
        .insert({
          user_id: session.session.user.id,
          task: newGoal.task,
          icon: newGoal.icon,
          weekday: newGoal.weekday,
          start_time: newGoal.start_time,
          end_time: newGoal.end_time,
        })
        .select();
        
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to add goal");
      }
      
      if (data) {
        setGoals([data[0], ...goals]);
        toast({
          title: "Goal added",
          description: "Your daily goal has been saved",
        });
      }
      
      setAddGoalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add goal",
        variant: "destructive",
      });
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditGoal(goal);
    setAddGoalOpen(true);
  };

  const handleUpdateGoal = async (updatedGoal: { task: string; icon: string | null; weekday: number[]; start_time: string | null; end_time: string | null }) => {
    if (!editGoal) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to update goals",
          variant: "destructive",
        });
        return;
      }

      const updatedData = {
        task: updatedGoal.task,
        icon: updatedGoal.icon,
        weekday: updatedGoal.weekday,
        start_time: updatedGoal.start_time,
        end_time: updatedGoal.end_time,
        updated_at: new Date().toISOString(),
      };

      console.log("Updating goal with data:", updatedData);

      const { error } = await supabase
        .from('daily_goals')
        .update(updatedData)
        .eq('id', editGoal.id);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to update goal");
      }

      setGoals(goals.map(goal =>
        goal.id === editGoal.id
          ? { ...goal, ...updatedData }
          : goal
      ));

      toast({
        title: "Goal updated",
        description: "Your daily goal has been updated",
      });

      setEditGoal(null);
      setAddGoalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to delete goals",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('daily_goals')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message || "Failed to delete goal");
      }
      
      setGoals(goals.filter(goal => goal.id !== id));
      toast({
        title: "Goal deleted",
        description: "Your daily goal has been deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  const handleToggleCompletion = async (goalId: string, date: string, isCompleted: boolean) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to update completions",
          variant: "destructive",
        });
        return;
      }

      const userId = session.session.user.id;
      
      if (isCompleted) {
        const { error } = await supabase
          .from('daily_goal_completions')
          .delete()
          .eq('goal_id', goalId)
          .eq('completed_date', date)
          .eq('user_id', userId);
          
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message || "Failed to delete completion");
        }
        
        setCompletions(completions.filter(
          c => !(c.goal_id === goalId && c.completed_date === date)
        ));
      } else {
        const { data, error } = await supabase
          .from('daily_goal_completions')
          .insert({
            goal_id: goalId,
            user_id: userId,
            completed_date: date,
          })
          .select();
          
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(error.message || "Failed to add completion");
        }
        
        if (data) {
          setCompletions([...completions, { goal_id: goalId, completed_date: date }]);
        }
      }
      
      await updateStreak(userId);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update completion status",
        variant: "destructive",
      });
    }
  };
  
  const updateStreak = async (userId: string) => {
    try {
      const { data: dailyCompletions, error: completionsError } = await supabase
        .from('daily_goal_completions')
        .select('completed_date')
        .eq('user_id', userId)
        .order('completed_date', { ascending: false });
        
      if (completionsError) {
        console.error("Supabase error:", completionsError);
        throw new Error(completionsError.message || "Failed to fetch completions");
      }
      
      const { data: userGoals, error: goalsError } = await supabase
        .from('daily_goals')
        .select('id')
        .eq('user_id', userId);
        
      if (goalsError) {
        console.error("Supabase error:", goalsError);
        throw new Error(goalsError.message || "Failed to fetch goals");
      }
      
      if (!dailyCompletions || dailyCompletions.length === 0) {
        return;
      }
      
      const completionsByDate = dailyCompletions.reduce((acc, curr) => {
        const date = curr.completed_date;
        if (!acc[date]) acc[date] = 0;
        acc[date]++;
        return acc;
      }, {} as Record<string, number>);
      
      const dates = Object.keys(completionsByDate).sort((a, b) => 
        new Date(b).getTime() - new Date(a).getTime()
      );
      
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const hasRecentCompletion = dates[0] === todayStr || dates[0] === yesterdayStr;
      
      if (!hasRecentCompletion) {
        await supabase
          .from('goal_streaks')
          .upsert({
            user_id: userId,
            current_streak: 0,
            last_completed_date: dates[0],
          }, { onConflict: 'user_id' });
          
        const { data: updatedStreak } = await supabase
          .from('goal_streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (updatedStreak) {
          setStreak(updatedStreak);
        }
        
        return;
      }
      
      let currentStreak = 1;
      let lastDate = new Date(dates[0]);
      
      for (let i = 1; i < dates.length; i++) {
        const currentDate = new Date(dates[i]);
        const dayDiff = Math.round((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else {
          break;
        }
      }
      
      const { data: existingStreak } = await supabase
        .from('goal_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      const longestStreak = existingStreak && existingStreak.longest_streak > currentStreak 
        ? existingStreak.longest_streak 
        : currentStreak;
      
      await supabase
        .from('goal_streaks')
        .upsert({
          user_id: userId,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_completed_date: dates[0],
        }, { onConflict: 'user_id' });
      
      const { data: updatedStreak } = await supabase
        .from('goal_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (updatedStreak) {
        setStreak(updatedStreak);
      }
      
    } catch (error) {
      console.error("Error updating streak:", error);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setAddGoalOpen(open);
    if (!open) {
      setEditGoal(null);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Daily Goals" 
        description="Track your daily habit progress" 
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <GoalsSummary streak={streak} goals={goals} completions={completions} />
            <AddGoalForm 
              open={addGoalOpen}
              setOpen={handleDialogOpenChange}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              editGoal={editGoal}
            />
          </div>
          
          <GoalsTable 
            goals={goals}
            completions={completions}
            onToggleCompletion={handleToggleCompletion}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
          />
        </div>
      )}
    </div>
  );
}
