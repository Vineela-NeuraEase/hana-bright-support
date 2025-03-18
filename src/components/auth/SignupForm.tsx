
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
import FormFields from "./form-components/FormFields";
import RoleSelector from "./form-components/RoleSelector";
import TermsAgreement from "./form-components/TermsAgreement";

// Sign up form schema
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["autistic", "caregiver", "clinician"] as const),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions."
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onFirebase?: boolean;
}

const SignupForm = ({ onFirebase = false }: SignupFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "autistic",
      acceptTerms: false
    }
  });

  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // Store the selected role in localStorage for profile creation
      localStorage.setItem('userRole', data.role);
      
      if (onFirebase) {
        // Firebase signup handled in FirebaseAuth component
        toast({
          title: "Using Firebase Auth",
          description: "This signup component is for demonstration only when Firebase is enabled.",
        });
      } else {
        // Sign up the user with Supabase
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) {
          console.error("Signup error:", error);
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email for a confirmation link."
          });
          if (authData.user) {
            navigate("/dashboard");
          }
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during signup.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4 pt-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
          <FormFields control={form.control} />
          <RoleSelector control={form.control} name="role" />
          <TermsAgreement control={form.control} name="acceptTerms" />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};

export default SignupForm;
