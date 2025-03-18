
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface SubtaskActionsProps {
  onSchedule: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirstItem: boolean;
  isLastItem: boolean;
  loading: boolean;
}

export const SubtaskActions = ({
  onSchedule,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirstItem,
  isLastItem,
  loading
}: SubtaskActionsProps) => {
  return (
    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onSchedule}
      >
        <Calendar className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onEdit}
      >
        <Plus className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onDelete}
        disabled={loading}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onMoveUp}
        disabled={loading || isFirstItem}
      >
        <ArrowUp className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onMoveDown}
        disabled={loading || isLastItem}
      >
        <ArrowDown className="h-3 w-3" />
      </Button>
    </div>
  );
};
