import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PomodoroInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PomodoroInfoDialog({ open, onOpenChange }: PomodoroInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:w-[80vw] md:max-w-md lg:max-w-lg min-h-[50vh] max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            What is the Pomodoro Technique?
          </DialogTitle>
          <DialogDescription id="pomodoro-dialog-description" className="text-xs sm:text-sm">
            Learn about the time management method that boosts productivity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 sm:space-y-4 text-xs sm:text-sm lg:text-base" aria-describedby="pomodoro-dialog-description">
          <p>
            The <strong>Pomodoro Technique</strong> is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
          </p>
          <p>
            Each 25-minute work session is called a "Pomodoro," named after the tomato-shaped kitchen timer Cirillo used. After four Pomodoros, you take a longer break to recharge.
          </p>
          <h3 className="font-semibold text-sm sm:text-base">How It Works:</h3>
          <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
            <li>Choose a task to focus on.</li>
            <li>Set a timer for 25 minutes and work uninterrupted (Pomodoro).</li>
            <li>Take a 5-minute break after each Pomodoro.</li>
            <li>After four Pomodoros, take a longer break (15–30 minutes).</li>
            <li>Repeat the cycle, tracking completed sessions.</li>
          </ul>
          <h3 className="font-semibold text-sm sm:text-base">Benefits:</h3>
          <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
            <li>Improves focus and concentration.</li>
            <li>Reduces mental fatigue through regular breaks.</li>
            <li>Enhances productivity by breaking tasks into manageable chunks.</li>
            <li>Helps track progress and maintain motivation.</li>
          </ul>
          <p>
            Use the Pomodoro timer in SecureVault to stay focused, manage your time effectively, and achieve your goals!
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            size="sm"
            className="sm:size-auto sm:px-4 sm:text-base"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}