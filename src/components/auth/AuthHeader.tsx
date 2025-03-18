
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AuthHeader = () => {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">Welcome to Hana</CardTitle>
      <CardDescription>
        Your Second Brain for Autism Support
      </CardDescription>
    </CardHeader>
  );
};

export default AuthHeader;
