
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";

// Define the form validation schema
const formSchema = z.object({
  message: z.string().min(1, "Message is required").max(500, "Message cannot exceed 500 characters"),
});

export type MessageFormData = z.infer<typeof formSchema>;

interface EncouragementMessageProps {
  userId: string;
}

export const EncouragementMessage = ({ userId }: EncouragementMessageProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<MessageFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: MessageFormData) => {
    try {
      // Get current user (caregiver)
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      // Insert the encouragement message
      const { error } = await supabase
        .from("caregiver_messages")
        .insert({
          message: data.message,
          caregiver_id: userData.user.id,
          user_id: userId,
          tags: ["encouragement"],
        });
      
      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Your encouragement message has been sent successfully.",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send encouragement message. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          Send Encouragement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send an Encouragement Message</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write an encouraging message..." 
                      className="resize-none" 
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <div className="flex justify-between">
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      {field.value.length}/500 characters
                    </p>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Send Message</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
