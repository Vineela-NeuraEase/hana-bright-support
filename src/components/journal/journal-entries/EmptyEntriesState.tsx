
import { Card, CardContent } from "@/components/ui/card";

interface EmptyEntriesStateProps {
  isMobile?: boolean;
}

export const EmptyEntriesState = ({ isMobile }: EmptyEntriesStateProps) => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6 text-center text-muted-foreground">
        {!isMobile && <h3 className="text-xl font-semibold mb-2">Journal Entries</h3>}
        No journal entries yet. Start by adding your first entry above!
      </CardContent>
    </Card>
  );
};
