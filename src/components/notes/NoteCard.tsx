import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Lock, Unlock, Pin, PinOff, Edit, Trash2, MoreVertical } from "lucide-react";

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  is_locked?: boolean;
  is_pinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onPinToggle: (id: string, isPinned: boolean) => void;
  onLockToggle: (id: string, isLocked: boolean) => void;
}

// Function to calculate luminance and determine text color
const getTextColor = (bgColor: string, customTextColor?: string) => {
  if (customTextColor) return customTextColor;
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

// Function to determine glow color based on lock and pin status
const getGlowColor = (isLocked?: boolean, isPinned?: boolean) => {
  if (isLocked && isPinned) return "#ef4444"; // Red for locked and pinned
  if (isPinned) return "#f97316"; // Orange for pinned only
  if (isLocked) return "#22c55e"; // Green for locked only
  return "#eab308"; // Yellow for default
};

// Function to process content, converting \n to <br> for plain text
const processContent = (content: string) => {
  // If content is plain text (no HTML tags), convert \n to <br>
  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return content.replace(/\n/g, '<br>');
  }
  // If content is HTML, return as-is
  return content;
};

export function NoteCard({ note, onUpdate, onDelete, onEdit, onPinToggle, onLockToggle }: NoteCardProps) {
  const textColor = getTextColor(note.color);
  const glowColor = getGlowColor(note.is_locked, note.is_pinned);

  return (
    <Card
      className="flex flex-col min-h-[200px] max-w-full transition-all duration-300 font-mono hover:shadow-[0_0_12px_3px] border-none outline-none rounded-md"
      style={{ 
        backgroundColor: note.color,
        "--glow-color": glowColor
      } as React.CSSProperties}
      onDoubleClick={() => onEdit(note)}
    >
      {/* Code Editor Header Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-t-md">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="ml-auto flex items-center gap-2">
          {note.is_pinned && (
            <Pin 
              className="h-3 w-3 transform transition-transform hover:rotate-12" 
              style={{ color: textColor }}
            />
          )}
          {note.is_locked && (
            <Lock 
              className="h-3 w-3" 
              style={{ color: textColor }}
            />
          )}
        </div>
      </div>
      <CardContent className="pt-4 pb-2 flex flex-col flex-grow bg-background/10 max-w-full px-4 overflow-x-hidden">
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: textColor }}
        >
          {note.title || "Untitled Note"}
        </h3>
        <div
          className="text-sm line-clamp-5 flex-grow break-words whitespace-pre-wrap max-w-full"
          style={{ color: textColor, overflowWrap: 'anywhere' }}
        >
         
            <div dangerouslySetInnerHTML={{ __html: processContent(note.content) }} />
          
        </div>
      </CardContent>
      <CardFooter className="flex justify-between py-2 mt-auto bg-transparent px-4">
        <div className="text-xs text-muted-foreground">
          {new Date(note.updatedAt).toLocaleDateString()}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onLockToggle(note.id, !note.is_locked)}>
              {note.is_locked ? (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  Unlock
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Lock
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPinToggle(note.id, !note.is_pinned)}>
              {note.is_pinned ? (
                <>
                  <PinOff className="mr-2 h-4 w-4" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="mr-2 h-4 w-4" />
                  Pin
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(note)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(note.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}