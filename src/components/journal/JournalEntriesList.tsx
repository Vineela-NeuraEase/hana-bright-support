
import { useState } from "react";
import { format } from "date-fns";
import { Smile, Meh, Frown, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { JournalEntry } from "@/types/journal";
import { useDeleteJournalEntry } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JournalEntriesListProps {
  entries: JournalEntry[];
}

export const JournalEntriesList = ({ entries }: JournalEntriesListProps) => {
  const deleteEntry = useDeleteJournalEntry();
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="text-red-500" />;
    if (mood <= 7) return <Meh className="text-amber-500" />;
    return <Smile className="text-green-500" />;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this journal entry?")) {
      deleteEntry.mutate(id);
    }
  };

  if (entries.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No journal entries yet. Start by adding your first entry above!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Your Journal Entries</h2>
      
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getMoodIcon(entry.mood_rating)}
                <CardTitle className="text-lg">
                  Mood: {entry.mood_rating}/10
                </CardTitle>
              </div>
              <CardDescription>
                {format(new Date(entry.timestamp), 'PPP p')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pb-3">
            {entry.sentiment && (
              <Badge className={`mb-2 ${getSentimentColor(entry.sentiment)}`}>
                {entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)}
              </Badge>
            )}
            
            {entry.journal_text && (
              <div className={expandedEntries[entry.id] ? '' : 'line-clamp-3'}>
                <p className="whitespace-pre-wrap">{entry.journal_text}</p>
              </div>
            )}
            
            {entry.journal_text && entry.journal_text.length > 150 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleExpand(entry.id)}
                className="mt-1 p-0 h-auto text-muted-foreground"
              >
                {expandedEntries[entry.id] ? (
                  <><ChevronUp className="h-4 w-4 mr-1" /> Show less</>
                ) : (
                  <><ChevronDown className="h-4 w-4 mr-1" /> Show more</>
                )}
              </Button>
            )}
          </CardContent>
          
          {entry.factors && entry.factors.length > 0 && (
            <CardContent className="pt-0 pb-3">
              <div className="flex flex-wrap gap-1">
                {entry.factors.map((factor, index) => (
                  <Badge key={index} variant="outline">{factor}</Badge>
                ))}
              </div>
            </CardContent>
          )}
          
          <CardFooter className="pt-0 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDelete(entry.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
