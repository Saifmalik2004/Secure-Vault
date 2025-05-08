import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AICard } from "@/components/ai-links/ai-card";
import { Search } from "lucide-react";
import { AITool, aiTools } from "@/components/ai-links/ai-data";

export default function AILinks() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tools by category based on search query
  const filteredTools = searchQuery
    ? aiTools.filter(tool =>
        tool.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : aiTools;

  // Group tools by category
  const categories = Array.from(new Set(aiTools.map(tool => tool.category)));
  const groupedTools = categories.reduce((acc, category) => {
    acc[category] = filteredTools.filter(tool => tool.category === category);
    return acc;
  }, {} as Record<string, AITool[]>);

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground dark:text-foreground">AI Tools</h1>
        <p className="text-muted-foreground dark:text-muted-foreground/80">
          Explore 200 AI tools categorized by their work
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-muted-foreground/80" />
        <Input
          placeholder="Search by work category (e.g., Research, Image Generation)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background dark:bg-background/95 border-foreground/20 dark:border-foreground/30 focus:ring-primary dark:focus:ring-primary/90"
        />
      </div>

      {/* Tool Sections */}
      {Object.entries(groupedTools).map(([category, tools]) => (
        tools.length > 0 && (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground dark:text-foreground">{category}</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {tools.map(tool => (
                <AICard
                  key={tool.id}
                  tool={{ id: tool.id, name: tool.name, url: tool.url }}
                />
              ))}
            </div>
          </div>
        )
      ))}

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted dark:bg-muted/80 mb-4">
            <Search className="h-8 w-8 text-muted-foreground dark:text-muted-foreground/80" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-foreground dark:text-foreground">No tools found</h2>
          <p className="text-muted-foreground dark:text-muted-foreground/80">
            Try searching for a different category (e.g., Research, Image Generation)
          </p>
        </div>
      )}
    </div>
  );
}