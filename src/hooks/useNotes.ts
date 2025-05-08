import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { hashPin } from "@/lib/encryption";
import { loadFromStorage, saveToStorage, PIN_HASH_KEY } from "@/lib/storage";
import { Note } from "@/components/notes/NoteCard";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
  const [pinPromptOpen, setPinPromptOpen] = useState(false);
  const [accessingNoteId, setAccessingNoteId] = useState<string | null>(null);
  const [pinHash, setPinHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [lockNoteId, setLockNoteId] = useState<string | null>(null);
  const [unlockNoteId, setUnlockNoteId] = useState<string | null>(null);
  const [unpinNoteId, setUnpinNoteId] = useState<string | null>(null);

  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please login to access your notes",
          variant: "destructive",
        });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Load notes on mount and when auth status changes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!isAuthenticated) return;

      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('secure_notes')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedNotes = data.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content || '',
            color: note.color || '#fff2cc',
            is_locked: note.is_locked || false,
            is_pinned: note.is_pinned || false,
            createdAt: note.created_at,
            updatedAt: note.updated_at,
          }));

          setNotes(formattedNotes);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();

    // Check if PIN is already set
    const storedPinHash = loadFromStorage(PIN_HASH_KEY, null);
    setPinHash(storedPinHash);
  }, [isAuthenticated, toast]);

  const handleAddNote = async (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to save notes",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        return;
      }

      let noteData = {
        title: newNote.title,
        content: newNote.content,
        color: newNote.color || '#fff2cc',
        is_locked: newNote.is_locked || false,
        is_pinned: newNote.is_pinned || false,
        user_id: session.user.id
      };

      if (id) {
        const { data, error } = await supabase
          .from('secure_notes')
          .update({
            ...noteData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select();

        if (error) {
          console.error("Update error:", error);
          throw error;
        }

        toast({
          title: "Note updated",
          description: "Your note has been updated successfully"
        });

        if (data && data[0]) {
          setNotes(notes.map(note =>
            note.id === id ? {
              ...note,
              ...newNote,
              updatedAt: data[0].updated_at
            } : note
          ));
        }
      } else {
        const { data, error } = await supabase
          .from('secure_notes')
          .insert(noteData)
          .select();

        if (error) {
          console.error("Insert error:", error);
          throw error;
        }

        if (data && data[0]) {
          const savedNote: Note = {
            id: data[0].id,
            title: data[0].title,
            content: data[0].content,
            color: data[0].color || '#fff2cc',
            is_locked: data[0].is_locked || false,
            is_pinned: data[0].is_pinned || false,
            createdAt: data[0].created_at,
            updatedAt: data[0].updated_at,
          };

          setNotes(prev => [savedNote, ...prev]);

          toast({
            title: "Note created",
            description: "Your note has been saved successfully"
          });
        }
      }

      setEditNote(null);
      setAddNoteOpen(false);
    } catch (error: any) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    const note = notes.find(note => note.id === id);

    setDeleteNoteId(id);

    if (note?.is_locked && pinHash) {
      setPinPromptOpen(true);
    } else {
      setDeleteConfirmationOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteNoteId) {
      setDeleteConfirmationOpen(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('secure_notes')
        .delete()
        .eq('id', deleteNoteId);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== deleteNoteId));

      toast({
        title: "Note deleted",
        description: "Your note has been permanently deleted"
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } finally {
      setDeleteNoteId(null);
      setDeleteConfirmationOpen(false);
    }
  };

  const handleEditNote = (note: Note) => {
    if (note.is_locked && pinHash) {
      setAccessingNoteId(note.id);
      setPinPromptOpen(true);
    } else {
      setEditNote(note);
      setAddNoteOpen(true);
    }
  };

  const handlePinToggle = async (id: string, isPinned: boolean) => {
    const note = notes.find(note => note.id === id);
    if (!note) return;

    if (!isPinned && note.is_locked && pinHash) {
      setUnpinNoteId(id);
      setPinPromptOpen(true);
    } else {
      try {
        const { error } = await supabase
          .from('secure_notes')
          .update({ is_pinned: isPinned, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;

        setNotes(notes.map(note =>
          note.id === id ? { ...note, is_pinned: isPinned, updatedAt: new Date().toISOString() } : note
        ));

        toast({
          title: isPinned ? "Note pinned" : "Note unpinned",
          description: isPinned ? "Your note is now pinned to the top" : "Your note has been unpinned"
        });
      } catch (error) {
        console.error("Error toggling pin:", error);
        toast({
          title: "Error",
          description: "Failed to update pin status",
          variant: "destructive",
        });
      }
    }
  };

  const handleLockToggle = async (id: string, isLocked: boolean) => {
    const note = notes.find(note => note.id === id);
    if (!note) return;

    if (isLocked && !pinHash) {
      setLockNoteId(id);
      setPinPromptOpen(true);
    } else if (!isLocked && note.is_locked && pinHash) {
      setUnlockNoteId(id);
      setPinPromptOpen(true);
    } else {
      try {
        const { error } = await supabase
          .from('secure_notes')
          .update({ is_locked: isLocked, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;

        setNotes(notes.map(note =>
          note.id === id ? { ...note, is_locked: isLocked, updatedAt: new Date().toISOString() } : note
        ));

        toast({
          title: isLocked ? "Note locked" : "Note unlocked",
          description: isLocked ? "Your note is now locked" : "Your note has been unlocked"
        });
      } catch (error) {
        console.error("Error toggling lock:", error);
        toast({
          title: "Error",
          description: "Failed to update lock status",
          variant: "destructive",
        });
      }
    }
  };

  const handlePINConfirmed = async (pin: string) => {
    setPinPromptOpen(false);

    const currentPinHash = hashPin(pin);

    if (lockNoteId && !pinHash) {
      saveToStorage(PIN_HASH_KEY, currentPinHash);
      setPinHash(currentPinHash);

      try {
        const { error } = await supabase
          .from('secure_notes')
          .update({ is_locked: true, updated_at: new Date().toISOString() })
          .eq('id', lockNoteId);

        if (error) throw error;

        setNotes(notes.map(note =>
          note.id === lockNoteId ? { ...note, is_locked: true, updatedAt: new Date().toISOString() } : note
        ));

        toast({
          title: "Note locked",
          description: "Your note is now locked with a PIN"
        });
      } catch (error) {
        console.error("Error locking note:", error);
        toast({
          title: "Error",
          description: "Failed to lock note",
          variant: "destructive",
        });
      } finally {
        setLockNoteId(null);
      }
      return;
    }

    const storedPinHash = loadFromStorage(PIN_HASH_KEY, null);

    if (currentPinHash !== storedPinHash) {
      toast({
        title: "Incorrect PIN",
        description: "The PIN you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    if (unpinNoteId) {
      try {
        const { error } = await supabase
          .from('secure_notes')
          .update({ is_pinned: false, updated_at: new Date().toISOString() })
          .eq('id', unpinNoteId);

        if (error) throw error;

        setNotes(notes.map(note =>
          note.id === unpinNoteId ? { ...note, is_pinned: false, updatedAt: new Date().toISOString() } : note
        ));

        toast({
          title: "Note unpinned",
          description: "Your note has been unpinned"
        });
      } catch (error) {
        console.error("Error unpinning note:", error);
        toast({
          title: "Error",
          description: "Failed to unpin note",
          variant: "destructive",
        });
      } finally {
        setUnpinNoteId(null);
      }
      return;
    }

    if (unlockNoteId) {
      try {
        const { error } = await supabase
          .from('secure_notes')
          .update({ is_locked: false, updated_at: new Date().toISOString() })
          .eq('id', unlockNoteId);

        if (error) throw error;

        setNotes(notes.map(note =>
          note.id === unlockNoteId ? { ...note, is_locked: false, updatedAt: new Date().toISOString() } : note
        ));

        toast({
          title: "Note unlocked",
          description: "Your note has been unlocked"
        });
      } catch (error) {
        console.error("Error unlocking note:", error);
        toast({
          title: "Error",
          description: "Failed to unlock note",
          variant: "destructive",
        });
      } finally {
        setUnlockNoteId(null);
      }
      return;
    }

    if (deleteNoteId) {
      setDeleteConfirmationOpen(true);
      return;
    }

    if (accessingNoteId) {
      try {
        const lockedNote = notes.find(note => note.id === accessingNoteId);
        if (!lockedNote) return;

        const { data, error } = await supabase
          .from('secure_notes')
          .select('*')
          .eq('id', accessingNoteId)
          .single();

        if (error) throw error;

        const noteForEditing = {
          ...lockedNote,
          content: data.content
        };

        setEditNote(noteForEditing);
        setAddNoteOpen(true);
      } catch (error) {
        console.error("Error accessing note:", error);
        toast({
          title: "Error",
          description: "Failed to access note",
          variant: "destructive",
        });
      } finally {
        setAccessingNoteId(null);
      }
    }
  };

  return {
    notes,
    searchQuery,
    setSearchQuery,
    addNoteOpen,
    setAddNoteOpen,
    editNote,
    setEditNote,
    deleteNoteId,
    setDeleteNoteId,
    pinPromptOpen,
    setPinPromptOpen,
    accessingNoteId,
    setAccessingNoteId,
    pinHash,
    isLoading,
    isAuthenticated,
    deleteConfirmationOpen,
    setDeleteConfirmationOpen,
    lockNoteId,
    setLockNoteId,
    unlockNoteId,
    setUnlockNoteId,
    unpinNoteId,
    setUnpinNoteId,
    handleAddNote,
    handleDeleteNote,
    confirmDelete,
    handleEditNote,
    handlePinToggle,
    handleLockToggle,
    handlePINConfirmed,
  };
};