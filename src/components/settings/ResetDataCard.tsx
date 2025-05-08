import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ResetDataCardProps {
  onResetData: () => void;
}

export function ResetDataCard({ onResetData }: ResetDataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-destructive">
          <Trash2 className="mr-2 h-5 w-5" /> Reset All Data
        </CardTitle>
        <CardDescription>
          Permanently delete all your stored data and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This action will permanently delete all your credentials, notes, and settings from the database. This cannot be undone.
        </p>
        <Button 
          onClick={onResetData}
          className="bg-destructive text-destructive-foreground"
        >
          Reset All Data
        </Button>
      </CardContent>
    </Card>
  );
}