
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface JournalEntryActionsProps {
  onDelete: () => void;
}

export const JournalEntryActions = ({ onDelete }: JournalEntryActionsProps) => {
  return (
    <CardFooter className="pt-0 flex justify-end">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onDelete}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </Button>
    </CardFooter>
  );
};
