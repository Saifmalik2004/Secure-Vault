
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Prompt } from "@/pages/Prompts";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface AddPromptFormProps {
  prompt?: Prompt;
  onSave: (prompt: any) => void;
  onCancel: () => void;
}

export function AddPromptForm({ prompt, onSave, onCancel }: AddPromptFormProps) {
  const [name, setName] = useState(prompt?.name || "");
  const [content, setContent] = useState(prompt?.content || "");
  const [description, setDescription] = useState(prompt?.description || "");
  const [errors, setErrors] = useState<{
    name?: string;
    content?: string;
  }>({});

  const isEditing = !!prompt;
  const title = isEditing ? "Edit Prompt" : "Add New Prompt";
  const buttonText = isEditing ? "Save Changes" : "Save Prompt";

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Prepare the prompt object
    const promptData = {
      name,
      content,
      description: description || null,
      ...(isEditing ? { id: prompt.id } : { user_id: (await supabase.auth.getUser()).data.user?.id })
    };

    onSave(promptData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Edit your saved prompt." : "Add a new prompt to your collection."}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Prompt"
            required
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this prompt is used for"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your prompt content here..."
            className="min-h-[200px] resize-y"
            required
          />
          {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
        </div>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {buttonText}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
