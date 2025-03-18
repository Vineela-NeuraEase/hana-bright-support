
import React, { useState } from "react";
import { Search, Info, RefreshCw, Smile, Meh, Frown, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function Judge() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter a message to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("transform-text", {
        body: {
          text: inputText,
          type: "judge"
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.result);
    } catch (error) {
      toast({
        title: "Error analyzing text",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error analyzing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = () => {
    const lowerAnalysis = analysis.toLowerCase();
    
    if (!analysis) return null;
    
    if (lowerAnalysis.includes("positive") || 
        lowerAnalysis.includes("happy") || 
        lowerAnalysis.includes("friendly") || 
        lowerAnalysis.includes("excited") ||
        lowerAnalysis.includes("pleased")) {
      return <Smile className="h-6 w-6 text-green-500" />;
    } else if (lowerAnalysis.includes("negative") || 
               lowerAnalysis.includes("angry") || 
               lowerAnalysis.includes("upset") || 
               lowerAnalysis.includes("annoyed") ||
               lowerAnalysis.includes("frustrated") ||
               lowerAnalysis.includes("disappointed")) {
      return <Frown className="h-6 w-6 text-red-500" />;
    } else {
      return <Meh className="h-6 w-6 text-yellow-500" />;
    }
  };

  const handleCopy = () => {
    if (!analysis) return;
    
    navigator.clipboard.writeText(analysis)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Analysis copied to clipboard.",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tone Judge
          </CardTitle>
          <CardDescription>
            Analyze the tone and sentiment of messages to better understand their emotional context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="message-text" className="text-sm font-medium">
              Message to analyze
            </label>
            <Textarea
              id="message-text"
              placeholder="Paste a message you've received to analyze its tone (e.g., 'I need to talk to you about your recent work')"
              className="min-h-32"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div>
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  <span>Analyze Tone</span>
                </>
              )}
            </Button>
          </div>

          {analysis && (
            <div className="mt-6 bg-muted rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getSentimentIcon()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium mb-2">Analysis Results:</h3>
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{analysis}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Judge;
