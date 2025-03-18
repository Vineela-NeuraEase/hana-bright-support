
import { JournalEntry } from "@/types/journal";
import { useDeleteJournalEntry } from "@/hooks/useJournal";
import { EmptyEntriesState } from "./EmptyEntriesState";
import { JournalEntryCard } from "./JournalEntryCard";

interface JournalEntriesListProps {
  entries: JournalEntry[];
  isMobile?: boolean;
}

export const JournalEntriesList = ({ entries, isMobile }: JournalEntriesListProps) => {
  const deleteEntry = useDeleteJournalEntry();

  const handleDelete = (id: string) => {
    deleteEntry.mutate(id);
  };

  if (entries.length === 0) {
    return <EmptyEntriesState isMobile={isMobile} />;
  }

  return (
    <div className="space-y-4 mt-6">
      {!isMobile && <h2 className="text-xl font-semibold">Your Journal Entries</h2>}
      
      {entries.map((entry) => (
        <JournalEntryCard 
          key={entry.id} 
          entry={entry} 
          onDelete={handleDelete} 
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
