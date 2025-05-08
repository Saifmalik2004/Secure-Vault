
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface NotesHeaderProps {
  hasPinConfigured: boolean;
  onAddNote: () => void;
}

export function NotesHeader({ hasPinConfigured, onAddNote }: NotesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Secure Notes</h1>
      {!hasPinConfigured ? (
        <Button asChild variant="default">
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Configure Security PIN
          </Link>
        </Button>
      ) : (
        <Button onClick={onAddNote}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      )}
    </div>
  );
}
