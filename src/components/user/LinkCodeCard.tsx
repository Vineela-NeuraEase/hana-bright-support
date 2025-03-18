
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CopyIcon, RefreshIcon, CheckIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const LinkCodeCard: React.FC = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session) return;
    
    const fetchLinkCode = async () => {
      try {
        setLoading(true);
        
        // Check if user already has a link code
        const { data, error } = await supabase
          .from('user_links')
          .select('link_code')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setLinkCode(data.link_code);
        } else {
          // Create a new link code
          await generateNewLinkCode();
        }
      } catch (error) {
        console.error('Error fetching link code:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your link code',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLinkCode();
  }, [session, toast]);

  const generateNewLinkCode = async () => {
    if (!session) return;
    
    try {
      setRefreshing(true);
      
      // Use a PostgreSQL function to generate a random code
      // This was created in our SQL migration
      const { data: linkCodeData, error: funcError } = await supabase
        .rpc('generate_link_code');

      if (funcError) throw funcError;
      
      const newLinkCode = linkCodeData;
      
      // Check if there's an existing record to update
      const { data: existingData, error: checkError } = await supabase
        .from('user_links')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_links')
          .update({ link_code: newLinkCode })
          .eq('id', existingData.id);
          
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_links')
          .insert([{ user_id: session.user.id, link_code: newLinkCode }]);
          
        if (insertError) throw insertError;
      }
      
      setLinkCode(newLinkCode);
      
      toast({
        title: 'Success',
        description: 'Link code regenerated successfully',
      });
    } catch (error) {
      console.error('Error generating link code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate new link code',
        variant: 'destructive',
      });
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = () => {
    if (!linkCode) return;
    
    navigator.clipboard.writeText(linkCode)
      .then(() => {
        setCopied(true);
        toast({
          title: 'Copied!',
          description: 'Link code copied to clipboard',
        });
        
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast({
          title: 'Error',
          description: 'Failed to copy to clipboard',
          variant: 'destructive',
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Link Code</CardTitle>
        <CardDescription>Share this code with your caregiver</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="h-10 bg-muted animate-pulse rounded" />
        ) : linkCode ? (
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-muted p-2 rounded flex-1 font-mono text-center text-lg">
                {linkCode}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1"
                onClick={generateNewLinkCode}
                disabled={refreshing}
              >
                <RefreshIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                This code allows caregivers to connect to your account and view your data. 
                Only share it with people you trust.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Button onClick={generateNewLinkCode} disabled={refreshing}>
            {refreshing ? 'Generating...' : 'Generate Link Code'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
