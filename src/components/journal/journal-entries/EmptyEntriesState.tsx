
import { Card, CardContent } from "@/components/ui/card";

export const EmptyEntriesState = () => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6 text-center text-muted-foreground">
        No journal entries yet. Start by adding your first entry above!
      </CardContent>
    </Card>
  );
};
