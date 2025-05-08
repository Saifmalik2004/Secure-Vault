
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/common/PageHeader";
import { PromptsList } from "@/components/prompts/PromptsList";
import { AddPromptForm } from "@/components/prompts/AddPromptForm";
import { SearchPrompts } from "@/components/prompts/SearchPrompts";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export interface Prompt {
  id: string;
  name: string;
  content: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

const Prompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      if (!isAuthenticated) {
        setPrompts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setPrompts(data || []);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        toast({
          title: "Error",
          description: "Failed to fetch prompts",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [isAuthenticated, toast]);

  const handleAddPrompt = async (newPrompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert([newPrompt])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setPrompts(prevPrompts => [data[0], ...prevPrompts]);
        setAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Prompt added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding prompt:', error);
      toast({
        title: "Error",
        description: "Failed to add prompt",
        variant: "destructive",
      });
    }
  };

  const handleEditPrompt = async (updatedPrompt: Prompt) => {
    try {
      const { id, ...promptData } = updatedPrompt;
      
      const { error } = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', id);

      if (error) throw error;

      setPrompts(prevPrompts => prevPrompts.map(prompt => 
        prompt.id === id ? updatedPrompt : prompt
      ));
      
      setEditingPrompt(null);
      toast({
        title: "Success",
        description: "Prompt updated successfully",
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrompts(prevPrompts => prevPrompts.filter(prompt => prompt.id !== id));
      toast({
        title: "Success",
        description: "Prompt deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Prompts" 
        description="Save and organize your favorite AI prompts"
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchPrompts onSearch={setSearchQuery} />
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Prompt
          </Button>
        </div>
      )}

      <PromptsList
        prompts={prompts}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        searchQuery={searchQuery}
        onAddPrompt={() => setAddDialogOpen(true)}
        onEditPrompt={setEditingPrompt}
        onDeletePrompt={handleDeletePrompt}
      />

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <AddPromptForm onSave={handleAddPrompt} onCancel={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPrompt} onOpenChange={(open) => !open && setEditingPrompt(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {editingPrompt && (
            <AddPromptForm 
              prompt={editingPrompt} 
              onSave={handleEditPrompt} 
              onCancel={() => setEditingPrompt(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Prompts;
