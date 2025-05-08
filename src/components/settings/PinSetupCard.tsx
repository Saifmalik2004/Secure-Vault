import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface PinSetupCardProps {
  hasPinConfigured: boolean;
  onOpenPinDialog: () => void;
}

export function PinSetupCard({ hasPinConfigured, onOpenPinDialog }: PinSetupCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" /> PIN Security
        </CardTitle>
        <CardDescription>
          {hasPinConfigured 
            ? "You have a security PIN configured. You can update it below."
            : "No security PIN is configured. Set one up to enhance your account security."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onOpenPinDialog}
          className="bg-primary text-primary-foreground"
        >
          {hasPinConfigured ? "Update PIN" : "Set PIN"}
        </Button>
      </CardContent>
    </Card>
  );
}