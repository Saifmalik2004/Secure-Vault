import { useEffect, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Note } from "./NoteCard";

const formSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  color: z.string(),
  is_locked: z.boolean().default(false),
});

interface AddNoteFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  note?: Note;
}

const noteColors = [
  { value: "#ffcccc", label: "Red" },
  { value: "#fff2cc", label: "Yellow" },
  { value: "#d4edda", label: "Green" },
  { value: "#d1ecf1", label: "Blue" },
  { value: "#e2d1f9", label: "Purple" },
  { value: "#f8d7da", label: "Pink" },
];

export function AddNoteForm({ open, onClose, onSave, note }: AddNoteFormProps) {
  const isEditing = !!note;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      color: note?.color || noteColors[0].value,
      is_locked: note?.is_locked || false,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  // Reset form when note or open state changes
  useEffect(() => {
    if (note) {
      // If editing an existing note, use its values
      form.reset({
        title: note.title,
        content: note.content,
        color: note.color,
        is_locked: note?.is_locked || false,
      });
    } else {
      form.reset({
        title: "",
        content: "",
        color: noteColors[0].value,
        is_locked: false,
      });
    }
  }, [note, open, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmitNote(values);
  }

  function handleSubmitNote(values: z.infer<typeof formSchema>) {
    const noteToSave = {
      title: values.title || "Untitled Note",
      content: values.content,
      color: values.color,
      is_locked: values.is_locked,
    };

    // Pass the original note ID if we're editing
    onSave(noteToSave, note?.id);

    // Reset the form only if we're not editing
    if (!isEditing) {
      form.reset({
        title: "",
        content: "",
        color: noteColors[0].value,
        is_locked: false,
      });
    }

    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update your sticky note." : "Add a new sticky note to your collection."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note here..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {noteColors.map((color) => (
                        <FormItem key={color.value} className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem
                              value={color.value}
                              id={color.value}
                              className="hidden"
                            />
                          </FormControl>
                          <label
                            htmlFor={color.value}
                            className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                              field.value === color.value ? "ring-2 ring-primary" : ""
                            }`}
                            style={{ backgroundColor: color.value }}
                          >
                            {field.value === color.value && (
                              <span className="text-black text-xl">✓</span>
                            )}
                          </label>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_locked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Lock Note</FormLabel>
                    <FormDescription>
                      Mark this note as locked
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Save Changes" : "Create Note"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}