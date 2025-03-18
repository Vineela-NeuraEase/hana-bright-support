
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CardContent } from "@/components/ui/card";
import LoginFields from "./form-components/LoginFields";
import RoleSelector from "./form-components/RoleSelector";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["autistic", "caregiver", "clinician"] as const)
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onFirebase?: boolean;
}

const LoginForm = ({ onFirebase = false }: LoginFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "autistic"
    }
  });

  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Store the selected role in localStorage for profile creation
      localStorage.setItem('userRole', data.role);
      
      if (onFirebase) {
        // The firebase implementation would be here, but we're not implementing it
        // in this component since that's handled in the FirebaseAuth component
        toast({
          title: "Using Firebase Auth",
          description: "This login component is for demonstration only when Firebase is enabled.",
        });
      } else {
        // Sign in the user with Supabase
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          console.error("Login error:", error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back",
            description: "You have been successfully signed in."
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4 pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <LoginFields control={form.control} />
          <RoleSelector control={form.control} name="role" />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};

export default LoginForm;
