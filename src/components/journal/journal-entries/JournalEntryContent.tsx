
import { useState } from "react";
import { ChevronDown, ChevronUp, Smile, Meh, Frown, ThermometerSnowflake, ThermometerSun, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JournalEntryContentProps {
  text?: string;
  sentiment?: string;
  factors?: string[];
  id: string;
}

export const JournalEntryContent = ({ text, sentiment, factors, id }: JournalEntryContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
      case 'happy':
        return 'bg-green-100 text-green-800';
      case 'negative':
      case 'sad':
      case 'frustrated':
      case 'angry':
        return 'bg-red-100 text-red-800';
      case 'anxious':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
      case 'happy':
        return <Smile className="h-4 w-4 mr-1 text-green-600" />;
      case 'negative':
      case 'sad':
        return <Frown className="h-4 w-4 mr-1 text-red-600" />;
      case 'neutral':
        return <Meh className="h-4 w-4 mr-1 text-gray-600" />;
      case 'frustrated':
      case 'angry':
        return <ThermometerSun className="h-4 w-4 mr-1 text-red-600" />;
      case 'anxious':
        return <AlertTriangle className="h-4 w-4 mr-1 text-amber-600" />;
      default:
        return <Meh className="h-4 w-4 mr-1 text-gray-600" />;
    }
  };

  const getSentimentLabel = (sentiment?: string) => {
    if (!sentiment) return 'Neutral';
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <>
      <CardContent className="pb-3">
        {sentiment && (
          <Badge className={`mb-2 flex items-center ${getSentimentColor(sentiment)}`}>
            {getSentimentIcon(sentiment)}
            {getSentimentLabel(sentiment)}
          </Badge>
        )}
        
        {text && (
          <div className={isExpanded ? '' : 'line-clamp-3'}>
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
        
        {text && text.length > 150 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand}
            className="mt-1 p-0 h-auto text-muted-foreground"
          >
            {isExpanded ? (
              <><ChevronUp className="h-4 w-4 mr-1" /> Show less</>
            ) : (
              <><ChevronDown className="h-4 w-4 mr-1" /> Show more</>
            )}
          </Button>
        )}
      </CardContent>
      
      {factors && factors.length > 0 && (
        <CardContent className="pt-0 pb-3">
          <div className="flex flex-wrap gap-1">
            {factors.map((factor, index) => (
              <Badge key={index} variant="outline">{factor}</Badge>
            ))}
          </div>
        </CardContent>
      )}
    </>
  );
};
