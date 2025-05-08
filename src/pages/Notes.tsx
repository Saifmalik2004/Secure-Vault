import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Note } from "@/components/notes/NoteCard";
import { AddNoteForm } from "@/components/notes/AddNoteForm";
import { PINPrompt } from "@/components/common/PINPrompt";
import { NotesHeader } from "@/components/notes/NotesHeader";
import { SearchBar } from "@/components/notes/SearchBar";
import { NoteList } from "@/components/notes/NoteList";
import { useNotes } from "@/hooks/useNotes";

export default function Notes() {
  const {
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
  } = useNotes();

  return (
    <div className="space-y-6">
      <NotesHeader 
        hasPinConfigured={!!pinHash}
        onAddNote={() => setAddNoteOpen(true)} 
      />

      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <NoteList 
        notes={notes}
        isLoading={isLoading}
        isAuthenticated={isAuthenticated}
        searchQuery={searchQuery}
        onAddNote={() => setAddNoteOpen(true)}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
        onPinToggle={handlePinToggle}
        onLockToggle={handleLockToggle}
      />
      
      <AddNoteForm
        open={addNoteOpen}
        onClose={() => {
          setAddNoteOpen(false);
          setEditNote(null);
        }}
        onSave={handleAddNote}
        note={editNote}
      />
      
      <PINPrompt
        open={pinPromptOpen}
        onClose={() => {
          setPinPromptOpen(false);
          setAccessingNoteId(null);
          setLockNoteId(null);
          setUnlockNoteId(null);
          setUnpinNoteId(null);
        }}
        onPINConfirmed={handlePINConfirmed}
        title={
          lockNoteId ? "Set a PIN to lock" :
          unlockNoteId ? "Enter your PIN to unlock" :
          unpinNoteId ? "Enter your PIN to unpin" :
          deleteNoteId ? "Enter your PIN to delete" :
          "Enter your PIN"
        }
        description={
          lockNoteId ? "Please set a PIN to lock this note" :
          unlockNoteId ? "Please enter your PIN to unlock this note" :
          unpinNoteId ? "Please enter your PIN to unpin this note" :
          deleteNoteId ? "Please enter your PIN to confirm note deletion" :
          "Please enter your PIN to unlock this note"
        }
      />
      
      <AlertDialog 
        open={deleteConfirmationOpen} 
        onOpenChange={(open) => {
          setDeleteConfirmationOpen(open);
          if (!open) setDeleteNoteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteConfirmationOpen(false);
              setDeleteNoteId(null);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}