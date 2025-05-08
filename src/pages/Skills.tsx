import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { SkillsList } from "@/components/skills/SkillsList";
import { AddSkillForm } from "@/components/skills/AddSkillForm";

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  progress: number;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_skills')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setSkills(data || []);
      } catch (error) {
        console.error("Error loading skills:", error);
        toast({
          title: "Error",
          description: "Failed to load skills",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [toast]);

  const handleAddSkill = async (newSkill: { 
    name: string; 
    description: string; 
    progress: number;
    target_date: string | null;
  }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to add skills",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('user_skills')
        .insert({
          user_id: session.session.user.id,
          name: newSkill.name,
          description: newSkill.description,
          progress: newSkill.progress,
          target_date: newSkill.target_date,
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setSkills([data[0], ...skills]);
        toast({
          title: "Skill added",
          description: "Your skill has been saved",
        });
      }
      
      setAddSkillOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add skill",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSkill = async (updatedSkill: { 
    id: string;
    name: string; 
    description: string; 
    progress: number;
    target_date: string | null;
  }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;
      
      const { id, ...skillData } = updatedSkill;
      
      const { error } = await supabase
        .from('user_skills')
        .update({
          ...skillData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setSkills(skills.map(skill => 
        skill.id === id ? { ...skill, ...skillData, updated_at: new Date().toISOString() } : skill
      ));
      
      toast({
        title: updatedSkill.progress === 100 ? "Achievement Unlocked!" : "Skill updated",
        description: updatedSkill.progress === 100 
          ? `${updatedSkill.name} has been mastered!` 
          : "Your skill has been updated",
      });
      
      setEditSkill(null);
      setAddSkillOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;
      
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSkills(skills.filter(skill => skill.id !== id));
      toast({
        title: "Skill deleted",
        description: "Your skill has been deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const handleEditSkill = (skill: Skill) => {
    setEditSkill(skill);
    setAddSkillOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Skills" 
        description="Track your skill development and progress" 
      />
      
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={() => setAddSkillOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <SkillsList 
          skills={skills} 
          onEdit={handleEditSkill}
          onDelete={handleDeleteSkill}
          onUpdateProgress={handleUpdateSkill}
        />
      )}

      <AddSkillForm 
        open={addSkillOpen}
        setOpen={setAddSkillOpen}
        onAddSkill={handleAddSkill}
        onUpdateSkill={handleUpdateSkill}
        editSkill={editSkill}
      />
    </div>
  );
}