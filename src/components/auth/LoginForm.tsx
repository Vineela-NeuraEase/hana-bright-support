
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import LoginFields from "./form-components/LoginFields";
import RoleSelector from "./form-components/RoleSelector";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["autistic", "caregiver", "clinician"] as const)
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
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
      
      // Sign in the user with Firebase
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      toast({
        title: "Welcome back",
        description: "You have been successfully signed in."
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Improved error handling with specific messages for different error codes
      let errorMessage = "An unexpected error occurred during login.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid login credentials. Please check your email and password.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
