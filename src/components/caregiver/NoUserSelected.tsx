
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export const NoUserSelected = () => {
  return (
    <Card className="h-full flex items-center justify-center py-12">
      <CardContent className="text-center">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No User Selected</h3>
        <p className="text-muted-foreground max-w-md">
          Select a linked individual from the sidebar to view their journal entries, tasks, and schedule.
        </p>
      </CardContent>
    </Card>
  );
};
