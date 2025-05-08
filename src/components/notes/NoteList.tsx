import { useState, useEffect } from "react";
import { File } from "lucide-react";
import { NoteCard, Note } from "./NoteCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  isAuthenticated: boolean;
  searchQuery: string;
  onAddNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onPinToggle: (id: string, isPinned: boolean) => void;
  onLockToggle: (id: string, isLocked: boolean) => void;
}

export function NoteList({ 
  notes, 
  isLoading, 
  isAuthenticated,
  searchQuery,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onPinToggle,
  onLockToggle
}: NoteListProps) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  // Filter and sort notes when search query or notes change
  useEffect(() => {
    let filtered = notes;
    
    // Apply search filter
    if (searchQuery) {
      filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (!note.is_locked && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Sort: pinned notes first, then by updatedAt descending
    const sortedNotes = filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    setFilteredNotes(sortedNotes);
  }, [searchQuery, notes]);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-[200px] w-full rounded-md"
          />
        ))}
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <File className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No notes found</h2>
        <p className="text-muted-foreground mb-6">
          {!isAuthenticated ? "Please login to access your notes" :
            notes.length === 0
              ? "You haven't created any notes yet"
              : "No notes match your search"}
        </p>
        {notes.length === 0 && isAuthenticated && (
          <Button onClick={onAddNote}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Note
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onUpdate={() => {}} // Not used directly
          onDelete={onDeleteNote}
          onEdit={onEditNote}
          onPinToggle={onPinToggle}
          onLockToggle={onLockToggle}
        />
      ))}
    </div>
  );
}