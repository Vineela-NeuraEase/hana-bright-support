
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/AuthProvider";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HeartHandshake } from "lucide-react";

const Encouragement = () => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { profile } = useProfile(session);
  const { toast } = useToast();
  
  // Get recipient ID from URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const recipientId = searchParams.get('to');
  
  if (!session || !profile || profile.role !== 'caregiver') {
    return (
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Only caregivers can send encouragement messages.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (!recipientId) {
    return (
      <div className="container py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">No recipient specified.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/people')}>
              Back to People
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const handleSendMessage = async () => {
    if (!message.trim() || !session || !recipientId) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('caregiver_messages')
        .insert({
          caregiver_id: session.user.id,
          user_id: recipientId,
          message: message.trim(),
          tags: ['encouragement']
        });
      
      if (error) throw error;
      
      toast({
        title: "Message sent!",
        description: "Your encouragement has been delivered."
      });
      
      // Clear form and navigate back
      setMessage("");
      navigate('/people');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send message"
      });
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center mb-6">
        <HeartHandshake className="h-6 w-6 mr-2 text-primary" />
        <h1 className="text-2xl font-bold">Send Encouragement</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Write an Encouraging Message</CardTitle>
          <CardDescription>
            Send a supportive note to help motivate and encourage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your encouraging message here..."
            className="min-h-[120px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/people')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !message.trim()}
          >
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Encouragement;
