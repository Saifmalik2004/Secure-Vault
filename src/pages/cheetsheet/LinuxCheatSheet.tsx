import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clipboard, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { cheatsheetCategories, Category, Command } from "@/data/linuxcheatsheet";
import {  toast } from "sonner";

export function LinuxCheatSheet() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});

  // Toggle dropdown for examples
  const toggleDropdown = (commandName: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [commandName]: !prev[commandName],
    }));
  };

  // Copy to clipboard with toast notification
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Syntax copied to clipboard!");
  };

  // Filter categories and commands based on search query
  const filteredCategories = cheatsheetCategories
    .map((category: Category) => ({
      ...category,
      commands: category.commands.filter((cmd: Command) =>
        cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category: Category) => category.commands.length > 0);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
     

      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-6">Linux Cheatsheet</h1>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by command, description, or category..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories and Commands */}
      {filteredCategories.length === 0 ? (
        <p className="text-muted-foreground">No commands found.</p>
      ) : (
        filteredCategories.map((category: Category) => (
          <div key={category.category} className="mb-8">
            {/* Category Header */}
            <h2 className="text-2xl font-semibold mb-4">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.commands.map((cmd: Command) => (
                <div
                  key={cmd.name}
                  className="border border-border rounded-lg p-4 bg-card shadow-sm"
                >
                  {/* Command Name and Copy Button */}
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">{cmd.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(cmd.syntax)}
                      title="Copy syntax"
                    >
                      <Clipboard size={16} />
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-2">{cmd.description}</p>

                  {/* Syntax */}
                  <div className="bg-muted p-2 rounded-md mb-2 border border-border">
                    <code className="text-sm font-mono">{cmd.syntax}</code>
                  </div>

                  {/* Examples Dropdown */}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={() => toggleDropdown(cmd.name)}
                  >
                    Show Examples
                    <ChevronDown
                      size={16}
                      className={cn(
                        "ml-1 transition-transform",
                        dropdownOpen[cmd.name] && "rotate-180"
                      )}
                    />
                  </Button>
                  {dropdownOpen[cmd.name] && (
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                      {cmd.examples.length > 0 ? (
                        cmd.examples.map((example, idx) => (
                          <li key={idx} className="mb-1">{example}</li>
                        ))
                      ) : (
                        <li>No examples available</li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}