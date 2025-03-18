
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Check, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  message: string;
  caregiver_id: string;
  created_at: string;
  read_at: string | null;
  tags: string[];
}

export const EncouragementList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
    }
  }, [session]);

  const fetchMessages = async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("caregiver_messages")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load messages. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("caregiver_messages")
        .update({ read_at: new Date().toISOString() })
        .eq("id", messageId);
      
      if (error) throw error;
      
      // Update the local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read_at: new Date().toISOString() } : msg
      ));
      
      toast({
        title: "Message marked as read",
        description: "This message has been marked as read.",
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark message as read.",
      });
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.read_at).length;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Loading Messages...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Encouragement Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            You don't have any messages yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Encouragement Messages
          {getUnreadCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getUnreadCount()} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message) => (
            <Card 
              key={message.id}
              className={`relative ${!message.read_at ? 'border-primary' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">From a caregiver</p>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </div>
                </div>
                <p className="mb-3">{message.message}</p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-1">
                    {message.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {!message.read_at && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => markAsRead(message.id)}
                      className="text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark as read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
