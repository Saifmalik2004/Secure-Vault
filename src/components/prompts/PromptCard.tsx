import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical, Copy } from "lucide-react";
import { Prompt } from "@/pages/Prompts";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyContent = () => {
    navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Copied to clipboard",
      description: "Prompt content copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="relative group bg-background/90 dark:bg-background/95 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.1)] border border-transparent hover:border-gradient-to-r hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 dark:hover:from-blue-300 dark:hover:via-purple-300 dark:hover:to-pink-300 min-h-[200px] max-h-[400px] flex flex-col">

  {/* Stacked Paper Effect */}
  <div className="absolute inset-0 bg-background/70 dark:bg-background/80 rounded-lg -z-10 transform rotate-1 scale-95 opacity-70 group-hover:opacity-85 dark:opacity-60 dark:group-hover:opacity-75 transition-opacity"></div>
  <div className="absolute inset-0 bg-background/50 dark:bg-background/60 rounded-lg -z-20 transform -rotate-1 scale-95 opacity-50 group-hover:opacity-65 dark:opacity-40 dark:group-hover:opacity-55 transition-opacity"></div>

  {/* Prompt Content */}
  <div className="space-y-3 flex-1">
    {/* Name */}
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-lg sm:text-xl font-semibold text-foreground dark:text-foreground truncate max-w-[75%] sm:max-w-[80%]">
        {prompt.name}
      </h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-foreground dark:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background dark:bg-background/95">
          <DropdownMenuItem onClick={() => onEdit(prompt)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyContent}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Content
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* Description */}
    {prompt.description && (
      <p className="text-sm sm:text-sm text-muted-foreground dark:text-muted-foreground/80 line-clamp-2 italic">
        {prompt.description}
      </p>
    )}

    {/* Content */}
    <div className="relative flex-1">
      <p className="text-sm sm:text-sm text-foreground dark:text-foreground whitespace-pre-wrap line-clamp-6 sm:line-clamp-6 bg-muted/10 dark:bg-muted/20 p-2 sm:p-3 rounded-md">
        {prompt.content}
      </p>
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 dark:from-background/80 to-transparent pointer-events-none"></div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-auto">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopyContent}
        className="hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition-colors border-foreground/20 dark:border-foreground/30 w-full sm:w-auto"
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onEdit(prompt)}
        className="hover:bg-green-500 hover:text-white dark:hover:bg-green-400 dark:hover:text-white transition-colors border-foreground/20 dark:border-foreground/30 w-full sm:w-auto"
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Button>
    </div>
  </div>

  {/* Delete Dialog */}
  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <AlertDialogContent className="bg-background dark:bg-background/95">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This will permanently delete the prompt "{prompt.name}".
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={() => onDelete(prompt.id)}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/80"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>

  );
}