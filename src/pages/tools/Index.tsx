
import React from "react";
import { Link } from "react-router-dom";
import { FilePenLine, Info, RadioTower } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ToolsDirectory = () => {
  const tools = [
    {
      id: "formalizer",
      name: "Formalizer",
      description: "Rewrite text in different tones while preserving the original meaning. Useful for emails, messages, and professional communication.",
      icon: <FilePenLine className="h-6 w-6" />,
      to: "/tools/formalizer",
    },
    {
      id: "judge",
      name: "Tone Judge",
      description: "Analyze the tone and sentiment of messages to better understand their emotional context and intent.",
      icon: <Info className="h-6 w-6" />,
      to: "/tools/judge",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6 gap-2">
        <RadioTower className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Communication Tools</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Card key={tool.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {tool.icon}
                <CardTitle>{tool.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{tool.description}</CardDescription>
            </CardContent>
            <CardFooter className="pt-2">
              <Button asChild>
                <Link to={tool.to}>Open Tool</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ToolsDirectory;
