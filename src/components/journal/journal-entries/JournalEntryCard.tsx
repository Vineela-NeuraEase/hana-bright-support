
import { format, parseISO } from "date-fns";
import { JournalEntry } from "@/types/journal";
import { Card } from "@/components/ui/card";
import { JournalEntryHeader } from "./JournalEntryHeader";
import { JournalEntryContent } from "./JournalEntryContent";
import { JournalEntryActions } from "./JournalEntryActions";

interface JournalEntryCardProps {
  entry: JournalEntry;
  isCaregiver?: boolean;
}

export const JournalEntryCard = ({ entry, isCaregiver = false }: JournalEntryCardProps) => {
  const formattedDate = entry.timestamp
    ? format(parseISO(entry.timestamp), "MMM d, yyyy h:mm a")
    : 'Unknown date';
  
  return (
    <Card className="overflow-hidden">
      <JournalEntryHeader
        date={formattedDate}
        rating={entry.mood_rating}
        id={entry.id}
      />
      <JournalEntryContent
        text={entry.journal_text}
        sentiment={entry.sentiment}
        factors={entry.factors}
        id={entry.id}
      />
      {!isCaregiver && <JournalEntryActions id={entry.id} />}
    </Card>
  );
};
