import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreVertical, ExternalLink, Link, EyeOff, Eye } from "lucide-react";
import { Link as LinkType } from "@/pages/Links";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface LinkCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
  onToggleHide: (id: string, isHide: boolean) => void;
}

export function LinkCard({ link, onEdit, onDelete, onToggleHide }: LinkCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [useFallbackIcon, setUseFallbackIcon] = useState(false);

  // Construct favicon URL using Google's favicon API
  const getFaviconUrl = (url: string) => {
    try {
      // Ensure the URL starts with http:// or https://
      const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
      return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(cleanUrl)}&size=64`;
    } catch {
      return null;
    }
  };

  return (
    <div className="relative group bg-background/90 dark:bg-background/95 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.1)] border border-transparent hover:border-gradient-to-r hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 dark:hover:from-blue-300 dark:hover:via-purple-300 dark:hover:to-pink-300 flex items-center gap-4">
      {/* Stacked Paper Effect */}
      <div className="absolute inset-0 bg-background/70 dark:bg-background/80 rounded-lg -z-10 transform rotate-1 scale-95 opacity-70 group-hover:opacity-85 dark:opacity-60 dark:group-hover:opacity-75 transition-opacity"></div>
      <div className="absolute inset-0 bg-background/50 dark:bg-background/60 rounded-lg -z-20 transform -rotate-1 scale-95 opacity-50 group-hover:opacity-65 dark:opacity-40 dark:group-hover:opacity-55 transition-opacity"></div>

      {/* Link Logo, Favicon, or Icon */}
      {link.logo_url ? (
        <img 
          src={link.logo_url} 
          alt={`${link.name} logo`} 
          className="w-10 h-10 rounded object-cover"
        />
      ) : !useFallbackIcon ? (
        <img
          src={getFaviconUrl(link.url)}
          alt={`${link.name} favicon`}
          className="w-10 h-10 rounded object-cover"
          onError={() => setUseFallbackIcon(true)} // Fall back to Link icon if favicon fails
        />
      ) : (
        <div className="w-10 h-10 rounded bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
          <Link className="h-5 w-5 text-primary dark:text-primary/80" />
        </div>
      )}

      {/* Link Details */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground dark:text-foreground truncate">{link.name}</p>
        <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 truncate">{link.url}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.open(link.url, "_blank")}
          className="hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition-colors border-foreground/20 dark:border-foreground/30"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="sr-only">Open Link</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-foreground dark:text-foreground"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background dark:bg-background/95">
            <DropdownMenuItem onClick={() => onEdit(link)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleHide(link.id, link.is_hide)}>
              {link.is_hide ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Unhide
                </>
              ) : (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide
                </>
              )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-background dark:bg-background/95">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the link "{link.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(link.id)}
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