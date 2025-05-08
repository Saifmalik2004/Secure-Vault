import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skill } from "@/pages/Skills";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(1, { message: "Skill name is required" }),
  description: z.string().optional(),
  progress: z.number().min(0).max(100),
  target_date: z.string().nullable(),
});

interface AddSkillFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddSkill: (skill: {
    name: string;
    description: string;
    progress: number;
    target_date: string | null;
  }) => void;
  onUpdateSkill: (skill: {
    id: string;
    name: string;
    description: string;
    progress: number;
    target_date: string | null;
  }) => void;
  editSkill: Skill | null;
}

export function AddSkillForm({ open, setOpen, onAddSkill, onUpdateSkill, editSkill }: AddSkillFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      progress: 0,
      target_date: null,
    },
  });

  useEffect(() => {
    if (editSkill) {
      const targetDate = editSkill.target_date 
        ? format(new Date(editSkill.target_date), "yyyy-MM-dd")
        : null;
      
      form.reset({
        name: editSkill.name,
        description: editSkill.description || "",
        progress: editSkill.progress,
        target_date: targetDate,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        progress: 0,
        target_date: null,
      });
    }
  }, [editSkill, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      if (editSkill) {
        await onUpdateSkill({
          id: editSkill.id,
          name: values.name,
          description: values.description || "",
          progress: values.progress,
          target_date: values.target_date,
        });
      } else {
        await onAddSkill({
          name: values.name,
          description: values.description || "",
          progress: values.progress,
          target_date: values.target_date,
        });
      }
      
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editSkill ? "Edit Skill" : "Add New Skill"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter skill name" 
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a short description" 
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FormField
                control={form.control}
                name="progress"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Current Progress</FormLabel>
                      <span className="text-sm font-medium">{Math.round(value)}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[0]}
                        value={[value]}
                        onValueChange={(vals) => onChange(vals[0])}
                        max={100}
                        step={1}
                        className="[&_.slider-track]:bg-gray-700 [&_.slider-range]:bg-gradient-to-r 
                          [&_.slider-range]:from-purple-500 [&_.slider-range]:to-indigo-500"
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <FormField
                control={form.control}
                name="target_date"
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Target Completion Date (Optional)</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="w-full bg-gray-800 border-gray-600 text-white rounded-md 
                          px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        {...rest}
                        value={value || ""}
                        onChange={onChange}
                        min={format(new Date(), "yyyy-MM-dd")}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </motion.div>
            
            <motion.div 
              className="flex justify-end space-x-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="outline" 
                type="button" 
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 
                  hover:to-indigo-600"
              >
                {isLoading ? "Saving..." : editSkill ? "Update Skill" : "Add Skill"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}