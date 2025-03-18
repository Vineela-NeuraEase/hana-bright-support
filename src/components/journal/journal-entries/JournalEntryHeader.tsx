
import { format } from "date-fns";
import { Smile, Meh, Frown } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface JournalEntryHeaderProps {
  mood: number;
  timestamp: string;
}

export const JournalEntryHeader = ({ mood, timestamp }: JournalEntryHeaderProps) => {
  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="text-red-500" />;
    if (mood <= 7) return <Meh className="text-amber-500" />;
    return <Smile className="text-green-500" />;
  };

  return (
    <CardHeader className="pb-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getMoodIcon(mood)}
          <CardTitle className="text-lg">
            Mood: {mood}/10
          </CardTitle>
        </div>
        <CardDescription>
          {format(new Date(timestamp), 'PPP p')}
        </CardDescription>
      </div>
    </CardHeader>
  );
};
