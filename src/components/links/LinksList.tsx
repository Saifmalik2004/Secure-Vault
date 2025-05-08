import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { LinkCard } from "./LinkCard";
import { Link as LinkType } from "@/pages/Links";
import { Skeleton } from "@/components/ui/skeleton";

interface LinksListProps {
  links: LinkType[];
  isLoading: boolean;
  isAuthenticated: boolean;
  searchQuery: string;
  showHiddenLinks: boolean;
  onAddLink: () => void;
  onEditLink: (link: LinkType) => void;
  onDeleteLink: (id: string) => void;
  onToggleHideLink: (id: string, isHide: boolean) => void;
}

export function LinksList({
  links,
  isLoading,
  isAuthenticated,
  searchQuery,
  showHiddenLinks,
  onAddLink,
  onEditLink,
  onDeleteLink,
  onToggleHideLink
}: LinksListProps) {
  // Filter links by search query and hide status
  const filteredLinks = searchQuery
    ? links.filter(link =>
        // Show links based on showHiddenLinks: if true, show only hidden links; if false, show only non-hidden
        (showHiddenLinks ? link.is_hide : !link.is_hide) &&
        (link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         link.url.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : links.filter(link => showHiddenLinks ? link.is_hide : !link.is_hide);

  if (isLoading) {
    // Display skeleton loaders in a vertical stack for loading state
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (filteredLinks.length === 0) {
    // Display empty state when no links match the criteria
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted dark:bg-muted/80 mb-4">
          <Link className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/80" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground dark:text-foreground">No links found</h2>
        <p className="text-muted-foreground dark:text-muted-foreground/80 mb-6">
          {!isAuthenticated ? "Please login to access your links" :
            links.length === 0
              ? "You haven't saved any links yet"
              : showHiddenLinks
                ? "No hidden links found"
                : "No visible links match your search"}
        </p>
        {links.length === 0 && isAuthenticated && (
          <Button onClick={onAddLink} className="bg-primary dark:bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Link
          </Button>
        )}
      </div>
    );
  }

  // Display links in a vertical stack of long rows
  return (
    <div className="space-y-4">
      {filteredLinks.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onEdit={onEditLink}
          onDelete={onDeleteLink}
          onToggleHide={onToggleHideLink}
        />
      ))}
    </div>
  );
}