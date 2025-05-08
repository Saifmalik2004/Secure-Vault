
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Bug } from "@/pages/BugLog";
import { Edit, Trash, Bug as BugIcon, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface BugsListProps {
  bugs: Bug[];
  onEdit: (bug: Bug) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export function BugsList({ bugs, onEdit, onDelete, onUpdateStatus }: BugsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default:
        return '';
    }
  };
  
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return '';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (bugs.length === 0) {
    return (
      <div className="text-center py-12">
        <BugIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No bugs found</h3>
        <p className="text-muted-foreground">
          Add your first bug by clicking the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bugs.map((bug) => (
        <Card key={bug.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{bug.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getPriorityBadgeStyle(bug.priority)}>
                  {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}
                </Badge>
                <Badge className={getBadgeStyle(bug.status)}>
                  {bug.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {bug.description ? (
              <p className="text-muted-foreground">{bug.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No description provided</p>
            )}
            <div className="text-xs text-muted-foreground mt-4">
              Updated {formatDate(bug.updated_at)}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Status <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdateStatus(bug.id, 'open')}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(bug.id, 'in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(bug.id, 'resolved')}>
                  Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdateStatus(bug.id, 'closed')}>
                  Closed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(bug)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setDeleteId(bug.id)}
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
              This will permanently delete this bug log. This action cannot be undone.
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
