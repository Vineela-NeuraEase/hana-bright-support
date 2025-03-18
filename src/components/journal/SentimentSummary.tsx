
import { useEffect, useState } from "react";
import { JournalEntry } from "@/types/journal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";
import { Smile, Frown, Meh, AlertTriangle, ThermometerSun } from "lucide-react";

interface SentimentSummaryProps {
  entries: JournalEntry[];
}

type SentimentCounts = {
  positive: number;
  negative: number;
  neutral: number;
  frustrated: number;
  anxious: number;
  happy: number;
  sad: number;
  angry: number;
};

export const SentimentSummary = ({ entries }: SentimentSummaryProps) => {
  const [weeklySentiments, setWeeklySentiments] = useState<SentimentCounts>({
    positive: 0,
    negative: 0,
    neutral: 0,
    frustrated: 0,
    anxious: 0,
    happy: 0,
    sad: 0,
    angry: 0
  });

  useEffect(() => {
    if (!entries || entries.length === 0) return;

    // Get current week's range
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);

    // Count sentiments for entries within this week
    const counts = entries.reduce((acc, entry) => {
      const entryDate = new Date(entry.timestamp);
      
      if (isWithinInterval(entryDate, { start, end })) {
        const sentiment = entry.sentiment || 'neutral';
        acc[sentiment as keyof SentimentCounts] = (acc[sentiment as keyof SentimentCounts] || 0) + 1;
      }
      
      return acc;
    }, {} as Record<string, number>);

    setWeeklySentiments({
      positive: counts.positive || 0,
      negative: counts.negative || 0,
      neutral: counts.neutral || 0,
      frustrated: counts.frustrated || 0,
      anxious: counts.anxious || 0,
      happy: counts.happy || 0,
      sad: counts.sad || 0,
      angry: counts.angry || 0
    });
  }, [entries]);

  // Calculate total entries this week
  const totalWeeklyEntries = Object.values(weeklySentiments).reduce((sum, count) => sum + count, 0);
  
  // Return null if no entries found this week
  if (totalWeeklyEntries === 0) {
    return null;
  }

  const getSummaryText = () => {
    const summaryParts = [];
    
    // Add positive sentiments
    const positiveCount = weeklySentiments.positive + weeklySentiments.happy;
    if (positiveCount > 0) {
      summaryParts.push(
        <span key="positive" className="flex items-center mr-2">
          <Smile className="h-4 w-4 mr-1 text-green-500" />
          {positiveCount} positive
        </span>
      );
    }
    
    // Add neutral sentiments
    if (weeklySentiments.neutral > 0) {
      summaryParts.push(
        <span key="neutral" className="flex items-center mr-2">
          <Meh className="h-4 w-4 mr-1 text-gray-500" />
          {weeklySentiments.neutral} neutral
        </span>
      );
    }
    
    // Add negative sentiments
    const negativeCount = weeklySentiments.negative + weeklySentiments.sad;
    if (negativeCount > 0) {
      summaryParts.push(
        <span key="negative" className="flex items-center mr-2">
          <Frown className="h-4 w-4 mr-1 text-red-500" />
          {negativeCount} negative
        </span>
      );
    }
    
    // Add frustrated/angry sentiments
    const frustratedCount = weeklySentiments.frustrated + weeklySentiments.angry;
    if (frustratedCount > 0) {
      summaryParts.push(
        <span key="frustrated" className="flex items-center mr-2">
          <ThermometerSun className="h-4 w-4 mr-1 text-red-600" />
          {frustratedCount} frustrated
        </span>
      );
    }
    
    // Add anxious sentiments
    if (weeklySentiments.anxious > 0) {
      summaryParts.push(
        <span key="anxious" className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
          {weeklySentiments.anxious} anxious
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-y-2">
        <span className="w-full md:w-auto md:mr-1">This week, you had:</span>
        {summaryParts}
      </div>
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weekly Mood Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {getSummaryText()}
      </CardContent>
    </Card>
  );
};
