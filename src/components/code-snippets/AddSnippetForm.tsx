
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeSnippet } from "@/pages/CodeSnippets";
import { Plus } from "lucide-react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "plaintext", label: "Plain Text" }
];

interface AddSnippetFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddSnippet: (snippet: { name: string; content: string; language: string }) => void;
  onUpdateSnippet: (snippet: { name: string; content: string; language: string }) => void;
  editSnippet: CodeSnippet | null;
}

export function AddSnippetForm({ 
  open, 
  setOpen, 
  onAddSnippet, 
  onUpdateSnippet,
  editSnippet 
}: AddSnippetFormProps) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Reset form or populate with edit data when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editSnippet) {
        setName(editSnippet.name);
        setContent(editSnippet.content);
        setLanguage(editSnippet.language);
      }
    } else {
      // Reset form when closing
      setName("");
      setContent("");
      setLanguage("javascript");
    }
  }, [open, editSnippet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const snippetData = { name, content, language };
    
    if (editSnippet) {
      onUpdateSnippet(snippetData);
    } else {
      onAddSnippet(snippetData);
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Snippet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editSnippet ? "Edit Snippet" : "Add New Snippet"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter snippet name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Code</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your code here"
              className="font-mono h-60 resize-none"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editSnippet ? "Update Snippet" : "Save Snippet"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
