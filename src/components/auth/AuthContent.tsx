
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

interface AuthContentProps {
  onFirebase?: boolean;
}

const AuthContent = ({ onFirebase = false }: AuthContentProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <AuthHeader />

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onFirebase={onFirebase} />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm onFirebase={onFirebase} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthContent;
