import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/common/PageHeader";
import { LinksList } from "@/components/links/LinksList";
import { AddLinkForm } from "@/components/links/AddLinkForm";
import { SearchLinks } from "@/components/links/SearchLinks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PINPrompt } from "@/components/common/PINPrompt";
import { Eye, EyeOff } from "lucide-react";
import { hashPin } from "@/lib/encryption";
import { loadFromStorage, saveToStorage, PIN_HASH_KEY } from "@/lib/storage";

export interface Link {
  id: string;
  name: string;
  url: string;
  logo_url: string | null;
  is_hide: boolean;
  created_at: string;
  updated_at: string;
}

const Links = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [showHiddenLinks, setShowHiddenLinks] = useState(false);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [pinHash, setPinHash] = useState<string | null>(null);
  const { toast } = useToast();

  // Check authentication status and load PIN hash
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    // Load stored PIN hash
    const storedPinHash = loadFromStorage(PIN_HASH_KEY, null);
    setPinHash(storedPinHash);

    return () => subscription.unsubscribe();
  }, []);

  // Fetch links from Supabase
  useEffect(() => {
    const fetchLinks = async () => {
      if (!isAuthenticated) {
        setLinks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('links')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setLinks(data || []);
      } catch (error) {
        console.error('Error fetching links:', error);
        toast({
          title: "Error",
          description: "Failed to fetch links",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [isAuthenticated, toast]);

  // Handle adding a new link
  const handleAddLink = async (newLink: Omit<Link, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('links')
        .insert([{ ...newLink, is_hide: false }]) // Ensure is_hide defaults to false
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setLinks(prevLinks => [data[0], ...prevLinks]);
        setAddDialogOpen(false);
        toast({
          title: "Success",
          description: "Link added successfully",
        });
      }
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Error",
        description: "Failed to add link",
        variant: "destructive",
      });
    }
  };

  // Handle editing an existing link
  const handleEditLink = async (updatedLink: Link) => {
    try {
      const { id, ...linkData } = updatedLink;
      
      const { error } = await supabase
        .from('links')
        .update({ ...linkData, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setLinks(prevLinks => prevLinks.map(link => 
        link.id === id ? updatedLink : link
      ));
      
      setEditingLink(null);
      toast({
        title: "Success",
        description: "Link updated successfully",
      });
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
    }
  };

  // Handle deleting a link
  const handleDeleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLinks(prevLinks => prevLinks.filter(link => link.id !== id));
      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  // Handle toggling the hide status of a link
  const handleToggleHideLink = async (id: string, isHide: boolean) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ is_hide: !isHide, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setLinks(prevLinks => prevLinks.map(link => 
        link.id === id ? { ...link, is_hide: !isHide } : link
      ));

      toast({
        title: "Success",
        description: `Link ${isHide ? 'unhidden' : 'hidden'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling hide status:', error);
      toast({
        title: "Error",
        description: "Failed to toggle hide status",
        variant: "destructive",
      });
    }
  };

  // Handle showing hidden links with PIN confirmation
  const handleShowHiddenLinks = () => {
    if (pinHash) {
      setPinPromptOpen(true); // Prompt for PIN if PIN is configured
    } else {
      setShowHiddenLinks(true); // Show hidden links directly if no PIN is set
    }
  };

  // Handle PIN confirmation for viewing hidden links
  const handlePINConfirmed = async (pin: string) => {
    const currentPinHash = hashPin(pin);
    const storedPinHash = loadFromStorage(PIN_HASH_KEY, null);

    if (currentPinHash !== storedPinHash) {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    setShowHiddenLinks(true);
    setPinPromptOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Links" 
        description="Save and manage your important links"
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchLinks onSearch={setSearchQuery} />
          <div className="flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              Add New Link
            </Button>
            <Button 
              variant="ghost"
              onClick={showHiddenLinks ? () => setShowHiddenLinks(false) : handleShowHiddenLinks}
            >
              {showHiddenLinks ? <EyeOff className="h-4 w-4 " /> : <Eye className="h-4 w-4" />}
            
            </Button>
          </div>
        </div>
      )}

      <LinksList
        links={links}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        searchQuery={searchQuery}
        showHiddenLinks={showHiddenLinks}
        onAddLink={() => setAddDialogOpen(true)}
        onEditLink={setEditingLink}
        onDeleteLink={handleDeleteLink}
        onToggleHideLink={handleToggleHideLink}
      />

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <AddLinkForm onSave={handleAddLink} onCancel={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {editingLink && (
            <AddLinkForm 
              link={editingLink} 
              onSave={handleEditLink} 
              onCancel={() => setEditingLink(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <PINPrompt
        open={pinPromptOpen}
        onClose={() => setPinPromptOpen(false)}
        onPINConfirmed={handlePINConfirmed}
        title="Enter your PIN"
        description="Please enter your PIN to view hidden links"
      />
    </div>
  );
};

export default Links;