
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CodeSnippet } from "@/pages/CodeSnippets";
import { Edit, Trash, Copy, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface SnippetsListProps {
  snippets: CodeSnippet[];
  onEdit: (snippet: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetsList({ snippets, onEdit, onDelete }: SnippetsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopyCode = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The code snippet has been copied to your clipboard.",
    });
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <Code className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No snippets found</h3>
        <p className="text-muted-foreground">
          Add your first code snippet by clicking the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <Card key={snippet.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="truncate">{snippet.name}</div>
              <span className="text-xs font-normal text-muted-foreground">
                {snippet.language}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-0 flex-grow">
            <div className="bg-muted text-muted-foreground p-3 rounded font-mono text-sm overflow-hidden max-h-48">
              <pre className="whitespace-pre-wrap break-all">{snippet.content}</pre>
            </div>
            <div className="text-xs text-muted-foreground mt-4">
              Updated {formatDate(snippet.updated_at)}
            </div>
          </CardContent>
          <CardFooter className="pt-4 flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCopyCode(snippet.content)}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(snippet)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDeleteId(snippet.id)}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this code snippet. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deleteId) {
                onDelete(deleteId);
                setDeleteId(null);
              }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
