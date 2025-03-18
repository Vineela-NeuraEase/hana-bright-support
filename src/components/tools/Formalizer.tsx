
import React, { useState } from "react";
import { FilePenLine, CopyCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const styles = [
  { value: "more_professional", label: "More Professional" },
  { value: "more_polite", label: "More Polite" },
  { value: "more_casual", label: "More Casual" },
  { value: "more_concise", label: "More Concise" },
  { value: "more_detailed", label: "More Detailed" },
  { value: "more_friendly", label: "More Friendly" },
  { value: "more_assertive", label: "More Assertive" },
  { value: "more_empathetic", label: "More Empathetic" }
];

export function Formalizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("more_professional");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTransform = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to transform.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("transform-text", {
        body: {
          text: inputText,
          style: selectedStyle.replace(/_/g, " "),
          type: "formalizer"
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setOutputText(data.result);
    } catch (error) {
      toast({
        title: "Error transforming text",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Error transforming text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Transformed text copied to clipboard.",
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
            <FilePenLine className="h-5 w-5" />
            Formalizer
          </CardTitle>
          <CardDescription>
            Transform your text into different styles while preserving the original meaning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="input-text" className="text-sm font-medium">
              Your text
            </label>
            <Textarea
              id="input-text"
              placeholder="Enter your draft message here (e.g., 'Hey boss, I'm running late today')"
              className="min-h-32"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="space-y-2 flex-1">
              <label htmlFor="style" className="text-sm font-medium">
                Style
              </label>
              <Select
                value={selectedStyle}
                onValueChange={setSelectedStyle}
              >
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-6">
              <Button 
                onClick={handleTransform} 
                disabled={isLoading || !inputText.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Transforming...</span>
                  </>
                ) : (
                  <>Transform</>
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="output-text" className="text-sm font-medium">
                Transformed text
              </label>
              {outputText && (
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <CopyCheck className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              id="output-text"
              placeholder="Transformed text will appear here"
              className="min-h-32 bg-muted"
              value={outputText}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Formalizer;
