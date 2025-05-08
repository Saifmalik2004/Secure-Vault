import { useState } from "react";
import { Copy, Eye, EyeOff, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PINPrompt } from "@/components/common/PINPrompt";

export interface Credential {
  id: string;
  name: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

interface CredentialCardProps {
  credential: Credential;
  onEdit: (credential: Credential, pin: string) => void;
  onDelete: (id: string, pin: string) => void;
  onView: (id: string, pin: string) => Promise<string | null>;
}

export function CredentialCard({ credential, onEdit, onDelete, onView }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState<string | null>(null);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pinAction, setPinAction] = useState<'view' | 'edit' | 'copy' | 'delete' | null>(null);
  
  const { toast } = useToast();

  const maskedUsername = credential.username.length > 10
    ? `${credential.username.substring(0, 3)}...${credential.username.substring(credential.username.length - 4)}`
    : credential.username;

  const handleCopyUsername = () => {
    navigator.clipboard.writeText(credential.username);
    toast({
      title: "Username copied",
      description: "Username has been copied to clipboard",
    });
  };

  const handleViewPassword = () => {
    if (showPassword) {
      // If password is already shown, hide it without PIN prompt
      setShowPassword(false);
      setPassword(null); // Clear decrypted password
    } else {
      // If password is hidden, show it after PIN confirmation
      setPinAction('view');
      setIsPinDialogOpen(true);
    }
  };

  const handleCopyPassword = () => {
    setPinAction('copy');
    setIsPinDialogOpen(true);
  };

  const handleEdit = () => {
    setPinAction('edit');
    setIsPinDialogOpen(true);
  };

  const handleDelete = () => {
    setPinAction('delete');
    setIsPinDialogOpen(true);
  };

  const handlePinConfirmed = async (pin: string) => {
    try {
      if (pinAction === 'view' || pinAction === 'copy') {
        console.log("Attempting to get password with PIN");
        const decryptedPassword = await onView(credential.id, pin);
        
        if (decryptedPassword === null) {
          toast({
            title: "Error",
            description: "Incorrect PIN or password could not be decrypted",
            variant: "destructive",
          });
          return;
        }

        if (pinAction === 'view') {
          setPassword(decryptedPassword);
          setShowPassword(true);
        } else if (pinAction === 'copy') {
          navigator.clipboard.writeText(decryptedPassword);
          toast({
            title: "Password copied",
            description: "Password has been copied to clipboard",
          });
        }
      } else if (pinAction === 'edit') {
        onEdit(credential, pin);
      } else if (pinAction === 'delete') {
        onDelete(credential.id, pin);
      }
    } catch (error) {
      console.error("Error in PIN action:", error);
      toast({
        title: "Error",
        description: "Failed to complete the requested action",
        variant: "destructive",
      });
    } finally {
      setIsPinDialogOpen(false);
      setPinAction(null);
    }
  };

  return (
    <>
      <Card className="card-hover">
        <CardContent className="pt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">{credential.name}</h3>
            <p className="text-sm text-muted-foreground">
              Username: {maskedUsername}
            </p>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              Password: 
              {showPassword && password ? (
                <span className="ml-2">{password}</span>
              ) : (
                <span className="ml-2">••••••••</span>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 ml-2"
                onClick={handleViewPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 flex-wrap">
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyUsername}
            >
              <Copy size={14} className="mr-1" /> Username
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyPassword}
            >
              <Copy size={14} className="mr-1" /> Password
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={handleEdit}
            >
              <Edit size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleDelete}
            >
              <Trash size={16} />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <PINPrompt 
        open={isPinDialogOpen}
        onClose={() => setIsPinDialogOpen(false)}
        onPINConfirmed={handlePinConfirmed}
        title={
          pinAction === 'view' ? "Enter PIN to view password" :
          pinAction === 'copy' ? "Enter PIN to copy password" :
          pinAction === 'edit' ? "Enter PIN to edit credential" :
          pinAction === 'delete' ? "Enter PIN to delete credential" : 
          "Enter your PIN"
        }
      />
    </>
  );
}