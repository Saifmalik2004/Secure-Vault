
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { SnippetsList } from "@/components/code-snippets/SnippetsList";
import { AddSnippetForm } from "@/components/code-snippets/AddSnippetForm";
import { SearchSnippets } from "@/components/code-snippets/SearchSnippets";
import { Loader2 } from "lucide-react";

export interface CodeSnippet {
  id: string;
  name: string;
  content: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export default function CodeSnippets() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addSnippetOpen, setAddSnippetOpen] = useState(false);
  const [editSnippet, setEditSnippet] = useState<CodeSnippet | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('code_snippets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setSnippets(data || []);
        setFilteredSnippets(data || []);
      } catch (error) {
        console.error("Error loading snippets:", error);
        toast({
          title: "Error",
          description: "Failed to load code snippets",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, [toast]);

  // Filter snippets when search query changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSnippets(snippets);
      return;
    }
    
    const filtered = snippets.filter(snippet => 
      snippet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredSnippets(filtered);
  }, [searchQuery, snippets]);

  const handleAddSnippet = async (newSnippet: { name: string; content: string; language: string }) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please login to add snippets",
          variant: "destructive",
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('code_snippets')
        .insert({
          user_id: session.session.user.id,
          name: newSnippet.name,
          content: newSnippet.content,
          language: newSnippet.language,
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setSnippets([data[0], ...snippets]);
        toast({
          title: "Snippet added",
          description: "Your code snippet has been saved",
        });
      }
      
      setAddSnippetOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add snippet",
        variant: "destructive",
      });
    }
  };

  const handleEditSnippet = (snippet: CodeSnippet) => {
    setEditSnippet(snippet);
    setAddSnippetOpen(true);
  };

  const handleUpdateSnippet = async (updatedSnippet: { name: string; content: string; language: string }) => {
    if (!editSnippet) return;
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;
      
      const { error } = await supabase
        .from('code_snippets')
        .update({
          name: updatedSnippet.name,
          content: updatedSnippet.content,
          language: updatedSnippet.language,
        })
        .eq('id', editSnippet.id);
        
      if (error) throw error;
      
      const updatedSnippets = snippets.map(snippet => 
        snippet.id === editSnippet.id 
          ? { ...snippet, ...updatedSnippet, updated_at: new Date().toISOString() } 
          : snippet
      );
      
      setSnippets(updatedSnippets);
      toast({
        title: "Snippet updated",
        description: "Your code snippet has been updated",
      });
      
      setEditSnippet(null);
      setAddSnippetOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update snippet",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSnippet = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return;
      
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSnippets(snippets.filter(snippet => snippet.id !== id));
      toast({
        title: "Snippet deleted",
        description: "Your code snippet has been deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete snippet",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Code Snippets" 
        description="Store and manage your code snippets" 
      />
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <SearchSnippets 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <AddSnippetForm 
          open={addSnippetOpen}
          setOpen={setAddSnippetOpen}
          onAddSnippet={handleAddSnippet}
          onUpdateSnippet={handleUpdateSnippet}
          editSnippet={editSnippet}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <SnippetsList 
          snippets={filteredSnippets} 
          onEdit={handleEditSnippet}
          onDelete={handleDeleteSnippet}
        />
      )}
    </div>
  );
}
