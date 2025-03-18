
import { useState, useMemo } from "react";
import { format, subDays, isWithinInterval } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JournalEntry } from "@/types/journal";

interface MoodTrendChartProps {
  entries: JournalEntry[];
}

type FilterOption = "7days" | "30days" | "all";

export const MoodTrendChart = ({ entries }: MoodTrendChartProps) => {
  const [filter, setFilter] = useState<FilterOption>("7days");

  const filteredEntries = useMemo(() => {
    const now = new Date();
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      
      if (filter === "7days") {
        return isWithinInterval(entryDate, {
          start: subDays(now, 7),
          end: now
        });
      } else if (filter === "30days") {
        return isWithinInterval(entryDate, {
          start: subDays(now, 30),
          end: now
        });
      }
      
      return true; // "all" filter
    });
  }, [entries, filter]);

  const chartData = useMemo(() => {
    return filteredEntries.map(entry => ({
      date: format(new Date(entry.timestamp), 'MMM dd'),
      mood: entry.mood_rating
    })).reverse();
  }, [filteredEntries]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3">
          <CardTitle className="text-xl">Mood Trends</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={filter === "7days" ? "default" : "outline"} 
              onClick={() => setFilter("7days")}
            >
              Last 7 Days
            </Button>
            <Button 
              size="sm" 
              variant={filter === "30days" ? "default" : "outline"} 
              onClick={() => setFilter("30days")}
            >
              Last 30 Days
            </Button>
            <Button 
              size="sm" 
              variant={filter === "all" ? "default" : "outline"} 
              onClick={() => setFilter("all")}
            >
              All Time
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 10,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis domain={[1, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Mood Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No data available for the selected time period.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
