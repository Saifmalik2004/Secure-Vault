import { useState, useMemo } from "react";
import { Skill } from "@/pages/Skills";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Trophy } from "lucide-react";
import { differenceInDays, format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface SkillsListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (updatedSkill: any) => void;
}

export function SkillsList({ skills, onEdit, onDelete, onUpdateProgress }: SkillsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const completedSkills = useMemo(() => skills.filter(skill => skill.progress >= 100), [skills]);
  const activeSkills = useMemo(() => skills.filter(skill => skill.progress < 100), [skills]);

  const getTimeRemaining = (targetDate: string | null) => {
    if (!targetDate) return null;
    
    const target = parseISO(targetDate);
    const today = new Date();
    const daysLeft = differenceInDays(target, today);
    
    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "1 day";
    return `${daysLeft} days`;
  };

  const handleProgressUpdate = (skill: Skill, increment: boolean) => {
    const newProgress = increment 
      ? Math.min(skill.progress + 5, 100) 
      : Math.max(skill.progress - 5, 0);
    
    onUpdateProgress({
      ...skill,
      progress: newProgress
    });
  };

  if (skills.length === 0) {
    return (
      <div className="text-center py-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl">
        <h3 className="text-xl font-bold text-white">No skills found</h3>
        <p className="text-gray-400">
          Start your journey by adding your first skill!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Achievements Section */}
      {completedSkills.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
          <div className="flex flex-wrap gap-2">
            {completedSkills.map(skill => (
              <motion.button
                key={skill.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium text-white flex items-center space-x-2 transition-colors ${
                  activeTab === skill.id 
                    ? 'bg-white/20' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                onClick={() => setActiveTab(activeTab === skill.id ? null : skill.id)}
              >
                <Trophy className="h-4 w-4" />
                <span>{skill.name}</span>
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence>
            {activeTab && completedSkills.find(s => s.id === activeTab) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="mt-4 p-4 bg-white/10 rounded-lg"
              >
                {completedSkills.find(s => s.id === activeTab)?.description && (
                  <p className="text-gray-200 text-sm mb-2">
                    {completedSkills.find(s => s.id === activeTab)?.description}
                  </p>
                )}
                <div className="flex items-center space-x-2">
                  <p className="text-gray-300 text-xs">
                    Mastered on: {format(
                      parseISO(completedSkills.find(s => s.id === activeTab)!.updated_at), 
                      "MMM d, yyyy"
                    )}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white hover:bg-white/10"
                      onClick={() => setDeleteId(activeTab)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Active Skills Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {activeSkills.map(skill => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl overflow-hidden
                border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-0 
                hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={() => onEdit(skill)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-white hover:bg-white/10"
                      onClick={() => setDeleteId(skill.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-gray-400 text-sm mb-4">{skill.description}</p>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span className="font-medium">{Math.round(skill.progress)}% complete</span>
                      {skill.target_date && (
                        <span className="text-gray-400">
                          {getTimeRemaining(skill.target_date)} remaining
                        </span>
                      )}
                    </div>
                    <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-indigo-500"
                        initial={{ width: `${skill.progress}%` }}
                        animate={{ width: `${skill.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    {skill.target_date && (
                      <p className="text-xs text-gray-400">
                        Target: {format(parseISO(skill.target_date), "MMM d, yyyy")}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={skill.progress <= 0}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => handleProgressUpdate(skill, false)}
                      >
                        -
                      </Button>
                      <Button
                        variant="outline" 
                        size="sm"
                        disabled={skill.progress >= 100}
                        className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => handleProgressUpdate(skill, true)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This will permanently delete this skill and all its progress data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (deleteId) {
                    onDelete(deleteId);
                    setDeleteId(null);
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </motion.div>
      </AlertDialog>
    </div>
  );
}