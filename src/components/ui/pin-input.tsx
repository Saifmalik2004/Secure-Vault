import * as React from "react";
import { cn } from "@/lib/utils";

export interface PinInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  length?: number;
  onComplete?: (value: string) => void;
  onChange?: (value: string) => void;
  value?: string;
}

const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  ({ className, length = 4, onComplete, onChange, value: externalValue, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string[]>(Array(length).fill(""));
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    
    // If external value is provided, use it to set internal state
    React.useEffect(() => {
      if (externalValue !== undefined) {
        const valueArray = externalValue.split("").concat(Array(length).fill("")).slice(0, length);
        setInternalValue(valueArray);
      }
    }, [externalValue, length]);

    const focusInput = (index: number) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]?.focus();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value;
      
      // Only accept the last character if multiple are entered
      const lastChar = value.slice(-1);
      
      if (lastChar === "" || /^\d$/.test(lastChar)) {
        const newPin = [...internalValue];
        newPin[index] = lastChar;
        setInternalValue(newPin);

        if (lastChar !== "" && index < length - 1) {
          focusInput(index + 1);
        }

        // Check if all fields are filled
        const newPinValue = newPin.join("");
        
        // Call onChange handler if provided
        if (onChange) {
          onChange(newPinValue);
        }
        
        if (newPinValue.length === length && !newPin.includes("") && onComplete) {
          onComplete(newPinValue);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace" && !internalValue[index] && index > 0) {
        focusInput(index - 1);
        
        // Clear the previous field on backspace
        const newPin = [...internalValue];
        newPin[index - 1] = "";
        setInternalValue(newPin);
        
        // Call onChange handler if provided
        if (onChange) {
          onChange(newPin.join(""));
        }
        
      } else if (e.key === "ArrowLeft" && index > 0) {
        focusInput(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        focusInput(index + 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text/plain").trim();
      
      if (/^\d+$/.test(pastedData)) {
        const newPin = [...internalValue];
        // Only use up to 'length' digits from pasted content
        const usableDigits = pastedData.slice(0, length);
        
        for (let i = 0; i < length; i++) {
          newPin[i] = i < usableDigits.length ? usableDigits[i] : "";
        }
        
        setInternalValue(newPin);
        
        // Call onChange handler if provided
        if (onChange) {
          onChange(newPin.join(""));
        }
        
        // If we fill all inputs, call onComplete
        if (usableDigits.length === length && onComplete) {
          onComplete(usableDigits);
        } else {
          // Focus the input after the last filled one
          focusInput(Math.min(usableDigits.length, length - 1));
        }
      }
    };

    return (
      <div 
        ref={ref} 
        className={cn("flex items-center justify-center gap-2", className)}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={1}
            value={internalValue[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={cn(
              "w-10 h-12 text-center border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-input text-xl",
              internalValue[index] ? "border-primary" : ""
            )}
            {...props}
          />
        ))}
      </div>
    );
  }
);

PinInput.displayName = "PinInput";

export { PinInput };
