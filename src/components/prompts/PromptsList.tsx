import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PromptCard } from "./PromptCard";
import { Prompt } from "@/pages/Prompts";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptsListProps {
  prompts: Prompt[];
  isLoading: boolean;
  isAuthenticated: boolean;
  searchQuery: string;
  onAddPrompt: () => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
}

export function PromptsList({
  prompts,
  isLoading,
  isAuthenticated,
  searchQuery,
  onAddPrompt,
  onEditPrompt,
  onDeletePrompt
}: PromptsListProps) {
  // Filter prompts by search query
  const filteredPrompts = searchQuery
    ? prompts.filter(prompt =>
        prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prompt.description && prompt.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : prompts;

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-[200px] w-full rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted dark:bg-muted/80 mb-4">
          <Lightbulb className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/80" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-foreground dark:text-foreground">No prompts found</h2>
        <p className="text-muted-foreground dark:text-muted-foreground/80 mb-6">
          {!isAuthenticated ? "Please login to access your prompts" :
            prompts.length === 0
              ? "You haven't created any prompts yet"
              : "No prompts match your search"}
        </p>
        {prompts.length === 0 && isAuthenticated && (
          <Button onClick={onAddPrompt} className="bg-primary dark:bg-primary/90 hover:bg-primary/90 dark:hover:bg-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Prompt
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onEdit={onEditPrompt}
          onDelete={onDeletePrompt}
        />
      ))}
    </div>
  );
}