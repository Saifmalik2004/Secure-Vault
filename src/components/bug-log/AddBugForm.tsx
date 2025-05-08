
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bug } from "@/pages/BugLog";
import { Plus } from "lucide-react";

interface AddBugFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddBug: (bug: { title: string; description: string; status: string; priority: string }) => void;
  onUpdateBug: (bug: { title: string; description: string; status: string; priority: string }) => void;
  editBug: Bug | null;
}

export function AddBugForm({ open, setOpen, onAddBug, onUpdateBug, editBug }: AddBugFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("medium");

  // Reset form or populate with edit data when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editBug) {
        setTitle(editBug.title);
        setDescription(editBug.description || "");
        setStatus(editBug.status);
        setPriority(editBug.priority);
      }
    } else {
      // Reset form when closing
      setTitle("");
      setDescription("");
      setStatus("open");
      setPriority("medium");
    }
  }, [open, editBug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bugData = { 
      title, 
      description, 
      status, 
      priority 
    };
    
    if (editBug) {
      onUpdateBug(bugData);
    } else {
      onAddBug(bugData);
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Bug</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editBug ? "Edit Bug" : "Add New Bug"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bug title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the bug in detail"
              className="h-32 resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editBug ? "Update Bug" : "Save Bug"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
