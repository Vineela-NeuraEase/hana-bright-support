
import { useState } from "react";
import { useCreateJournalEntry } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Smile, Meh, Frown, Heart, HeartCrack, Angry, Laugh } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export const MoodInput = () => {
  const createEntry = useCreateJournalEntry();
  const { session } = useAuth();
  
  const [moodRating, setMoodRating] = useState<number>(5);

  const getMoodIcon = (mood: number) => {
    if (mood <= 2) return <Angry className="text-red-600 h-12 w-12" />;
    if (mood <= 4) return <Frown className="text-red-400 h-12 w-12" />;
    if (mood <= 6) return <Meh className="text-amber-500 h-12 w-12" />;
    if (mood <= 8) return <Smile className="text-green-500 h-12 w-12" />;
    return <Laugh className="text-green-600 h-12 w-12" />;
  };

  const getMoodLabel = (mood: number) => {
    if (mood <= 2) return "Very Upset";
    if (mood <= 4) return "Feeling Down";
    if (mood <= 6) return "Okay";
    if (mood <= 8) return "Good";
    return "Excellent!";
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
        journal_text: "",
        factors: [],
      });
      
      toast.success("Mood saved! Now let's identify what factors are affecting your mood.");
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast.error("Failed to save your mood");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="text-center mb-4">
            <div className="flex flex-col items-center justify-center gap-2">
              {getMoodIcon(moodRating)}
              <span className="text-xl font-medium">
                {getMoodLabel(moodRating)}
              </span>
              <span className="text-lg text-muted-foreground">
                ({moodRating}/10)
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 justify-center">
              <HeartCrack className="text-rose-500 h-6 w-6" />
              <div className="w-full">
                <Slider 
                  value={[moodRating]} 
                  min={1} 
                  max={10} 
                  step={1} 
                  onValueChange={(values) => setMoodRating(values[0])} 
                />
              </div>
              <Heart className="text-rose-500 h-6 w-6" />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={createEntry.isPending}
        >
          {createEntry.isPending ? "Saving..." : "Save Mood"}
        </Button>
      </form>
    </div>
  );
};
