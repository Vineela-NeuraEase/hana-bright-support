
import { useState } from "react";
import { useCreateJournalEntry } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Smile, Meh, Frown } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export const JournalForm = ({ moodOnly = false }) => {
  const createEntry = useCreateJournalEntry();
  const { session } = useAuth();
  
  const [moodRating, setMoodRating] = useState<number>(5);
  const [journalText, setJournalText] = useState<string>("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const getMoodIcon = (mood: number) => {
    if (mood <= 3) return <Frown className="text-red-500 h-8 w-8" />;
    if (mood <= 7) return <Meh className="text-amber-500 h-8 w-8" />;
    return <Smile className="text-green-500 h-8 w-8" />;
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 3) return "Feeling Low";
    if (mood <= 7) return "Feeling Okay";
    return "Feeling Great";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error("You must be logged in to create journal entries");
      return;
    }

    if (moodRating < 1 || moodRating > 10) {
      toast.error("Please select a mood rating between 1 and 10");
      return;
    }

    try {
      await createEntry.mutateAsync({
        mood_rating: moodRating,
        journal_text: journalText,
        factors: selectedFactors,
      });
      
      // Reset the form after successful submission
      setMoodRating(5);
      setJournalText("");
      setSelectedFactors([]);
    } catch (error) {
      console.error("Error creating journal entry:", error);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-xl">How are you feeling today?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center">
              <Frown className="text-gray-400" />
              <div className="w-full">
                <Slider 
                  value={[moodRating]} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={(values) => setMoodRating(values[0])} 
                />
              </div>
              <Smile className="text-gray-400" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                {getMoodIcon(moodRating)}
                <span className="text-lg font-medium">
                  {getMoodLabel(moodRating)} ({moodRating}/10)
                </span>
              </div>
            </div>
          </div>

          {!moodOnly && (
            <div className="space-y-2">
              <label htmlFor="journal-text" className="text-md font-medium">
                What's on your mind today?
              </label>
              <Textarea
                id="journal-text"
                className="min-h-[120px]"
                placeholder="Write your thoughts here..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={createEntry.isPending}
          >
            {createEntry.isPending ? "Saving..." : "Next"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
