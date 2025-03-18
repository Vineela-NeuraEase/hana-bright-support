
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Profile } from "@/hooks/useProfile";

interface MyLinkCodeProps {
  profile: Profile | null;
}

export const MyLinkCode = ({ profile }: MyLinkCodeProps) => {
  if (!profile) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Link Code</CardTitle>
        <CardDescription>
          Share this code with others if you want them to link to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-md font-mono text-center text-lg">
          {profile.link_code || "No link code available"}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Keep this code private and only share with trusted individuals.
      </CardFooter>
    </Card>
  );
};
