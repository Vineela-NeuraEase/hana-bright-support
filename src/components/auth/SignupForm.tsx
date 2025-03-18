
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { CardContent } from "@/components/ui/card";

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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am a...</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
                      <RadioGroupItem value="autistic" id="signup-autistic" />
                      <Label htmlFor="signup-autistic" className="flex-grow cursor-pointer">Neurodivergent Individual</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
                      <RadioGroupItem value="caregiver" id="signup-caregiver" />
                      <Label htmlFor="signup-caregiver" className="flex-grow cursor-pointer">Caregiver</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted transition-all">
                      <RadioGroupItem value="clinician" id="signup-clinician" />
                      <Label htmlFor="signup-clinician" className="flex-grow cursor-pointer">Clinician</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                    id="accept-terms"
                  />
                </FormControl>
                <FormLabel htmlFor="accept-terms" className="font-normal">
                  I accept the terms of service and privacy policy
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

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
