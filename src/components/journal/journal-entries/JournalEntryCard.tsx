
import { JournalEntry } from "@/types/journal";
import { Card } from "@/components/ui/card";
import { JournalEntryHeader } from "./JournalEntryHeader";
import { JournalEntryContent } from "./JournalEntryContent";
import { JournalEntryActions } from "./JournalEntryActions";

interface JournalEntryCardProps {
  entry: JournalEntry;
  isCaregiver?: boolean;
  onDelete?: (id: string) => void;
  isMobile?: boolean;
}

export const JournalEntryCard = ({ 
  entry, 
  isCaregiver = false, 
  onDelete, 
  isMobile 
}: JournalEntryCardProps) => {
  
  return (
    <Card className="overflow-hidden">
      <JournalEntryHeader
        mood={entry.mood_rating}
        timestamp={entry.timestamp}
      />
      <JournalEntryContent
        text={entry.journal_text}
        sentiment={entry.sentiment}
        factors={entry.factors}
        id={entry.id}
      />
      {!isCaregiver && onDelete && (
        <JournalEntryActions 
          onDelete={() => onDelete(entry.id)} 
          isMobile={isMobile} 
        />
      )}
    </Card>
  );
};
