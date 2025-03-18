
import { useState } from "react";
import { useCreateJournalEntry } from "@/hooks/useJournal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/components/AuthProvider";

// Common factors that might affect mood
const COMMON_FACTORS = [
  "Poor sleep",
  "Good sleep",
  "Stressful day",
  "Relaxing day",
  "Social interaction",
  "Social conflict",
  "Exercise",
  "Pain/discomfort",
  "Weather",
  "Food/Nutrition",
  "Work stress",
  "Family time",
  "Sensory overload",
  "Quiet environment",
  "New routine",
];

export const MoodFactors = () => {
  const createEntry = useCreateJournalEntry();
  const { session } = useAuth();
  
  const [journalText, setJournalText] = useState<string>("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);

  const handleFactorToggle = (factor: string) => {
    setSelectedFactors((prev) => 
      prev.includes(factor) 
        ? prev.filter((f) => f !== factor) 
        : [...prev, factor]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error("You must be logged in to create journal entries");
      return;
    }

    if (selectedFactors.length === 0) {
      toast.error("Please select at least one factor affecting your mood");
      return;
    }

    try {
      await createEntry.mutateAsync({
        mood_rating: 5, // This will be updated with the actual mood from the previous page
        journal_text: journalText,
        factors: selectedFactors,
      });
      
      // Reset the form after successful submission
      setJournalText("");
      setSelectedFactors([]);
      
      toast.success("Mood factors saved!");
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast.error("Failed to save mood factors");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl mb-2">What factors are affecting your mood?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-0">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {COMMON_FACTORS.map((factor) => (
                <Button
                  key={factor}
                  type="button"
                  variant={selectedFactors.includes(factor) ? "default" : "outline"}
                  className="rounded-full text-xs px-3 py-1 h-auto"
                  onClick={() => handleFactorToggle(factor)}
                >
                  {factor}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="other-factors" className="text-md font-medium block mb-1">
              Other factors or notes
            </label>
            <Textarea
              id="other-factors"
              className="min-h-[80px]"
              placeholder="Any other factors affecting your mood today?"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="px-0 pt-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={createEntry.isPending}
          >
            {createEntry.isPending ? "Saving..." : "Save Factors"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};
