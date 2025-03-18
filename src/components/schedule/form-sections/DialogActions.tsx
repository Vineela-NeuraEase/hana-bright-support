
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DialogActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export const DialogActions = ({ 
  isEditing, 
  isSubmitting, 
  onDelete, 
  onClose 
}: DialogActionsProps) => {
  return (
    <DialogFooter className="flex justify-between items-center gap-2 pt-4">
      {isEditing && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDelete} 
          disabled={isSubmitting}
          className="mr-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isEditing ? "Save Changes" : "Create Event"}
      </Button>
    </DialogFooter>
  );
};
