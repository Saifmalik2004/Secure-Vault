
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/ui/pin-input";
import { useToast } from "@/components/ui/use-toast";

interface PINPromptProps {
  open: boolean;
  onClose: () => void;
  onPINConfirmed: (pin: string) => Promise<void> | void;
  title?: string;
  description?: string;
}

export function PINPrompt({
  open,
  onClose,
  onPINConfirmed,
  title = "Enter your PIN",
  description = "Please enter your 4-digit PIN to continue."
}: PINPromptProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset pin and error when dialog opens/closes
  useEffect(() => {
    if (open) {
      setPin("");
      setError(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const validatePin = (value: string) => {
    if (value.length !== 4) {
      return "PIN must be exactly 4 digits";
    }
    if (!/^\d{4}$/.test(value)) {
      return "PIN can only contain numbers";
    }
    return null;
  };

  const handlePinChange = (value: string) => {
    setPin(value);
    setError(null);
  };

  const handleConfirm = async () => {
    const validationError = validatePin(pin);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle both Promise and void return types
      const result = onPINConfirmed(pin);
      if (result instanceof Promise) {
        await result;
      }
      setPin("");
      setError(null);
      onClose();
    } catch (error: any) {
      setError(error.message || "Incorrect PIN or action failed");
      toast({
        title: "Error",
        description: error.message || "Failed to complete the action",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPin("");
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <PinInput
            length={4}
            onChange={handlePinChange}
            className="justify-center"
            value={pin}
            disabled={isSubmitting}
            type="password"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!pin || pin.length !== 4 || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
