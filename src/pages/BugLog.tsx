
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BugsList } from "@/components/bug-log/BugsList";
import { AddBugForm } from "@/components/bug-log/AddBugForm";
import { SearchBugs } from "@/components/bug-log/SearchBugs";
import { Loader2 } from "lucide-react";

export interface Bug {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export default function BugLog() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addBugOpen, setAddBugOpen] = useState(false);
  const [editBug, setEditBug] = useState<Bug | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('bug_logs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setBugs(data || []);
        setFilteredBugs(data || []);
      } catch (error) {
        console.error("Error loading bugs:", error);
        toast({
          title: "Error",
          description: "Failed to load bug logs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBugs();
  }, [toast]);

  // Filter bugs when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBugs(bugs);
      return;
    }
    
    const filtered = bugs.filter(bug => 
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bug.description && bug.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      bug.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.priority.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredBugs(filtered);
  }, [searchQuery, bugs]);

  const handleAddBug = async (newBug: { title: string; description: string; status: string; priority: string }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to add bugs",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('bug_logs')
        .insert({
          user_id: session.session.user.id,
          title: newBug.title,
          description: newBug.description,
          status: newBug.status,
          priority: newBug.priority,
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setBugs([data[0], ...bugs]);
        toast({
          title: "Bug added",
          description: "Your bug log has been saved",
        });
      }
      
      setAddBugOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add bug",
        variant: "destructive",
      });
    }
  };

  const handleEditBug = (bug: Bug) => {
    setEditBug(bug);
    setAddBugOpen(true);
  };

  const handleUpdateBug = async (updatedBug: { title: string; description: string; status: string; priority: string }) => {
    if (!editBug) return;
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;
      
      const { error } = await supabase
        .from('bug_logs')
        .update({
          title: updatedBug.title,
          description: updatedBug.description,
          status: updatedBug.status,
          priority: updatedBug.priority,
        })
        .eq('id', editBug.id);
        
      if (error) throw error;
      
      const updatedBugs = bugs.map(bug => 
        bug.id === editBug.id 
          ? { ...bug, ...updatedBug, updated_at: new Date().toISOString() } 
          : bug
      );
      
      setBugs(updatedBugs);
      toast({
        title: "Bug updated",
        description: "Your bug log has been updated",
      });
      
      setEditBug(null);
      setAddBugOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update bug",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBug = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;
      
      const { error } = await supabase
        .from('bug_logs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBugs(bugs.filter(bug => bug.id !== id));
      toast({
        title: "Bug deleted",
        description: "Your bug log has been deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bug",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bug_logs')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      const updatedBugs = bugs.map(bug => 
        bug.id === id 
          ? { ...bug, status, updated_at: new Date().toISOString() } 
          : bug
      );
      
      setBugs(updatedBugs);
      toast({
        title: "Status updated",
        description: `Bug status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Bug Log" 
        description="Track and manage bugs and issues" 
      />
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchBugs 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <AddBugForm 
          open={addBugOpen}
          setOpen={setAddBugOpen}
          onAddBug={handleAddBug}
          onUpdateBug={handleUpdateBug}
          editBug={editBug}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <BugsList 
          bugs={filteredBugs} 
          onEdit={handleEditBug}
          onDelete={handleDeleteBug}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
