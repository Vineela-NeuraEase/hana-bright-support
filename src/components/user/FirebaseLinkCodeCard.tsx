
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CopyIcon, RefreshCw, CheckIcon } from "lucide-react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";
import { useToast } from "@/hooks/use-toast";

export const FirebaseLinkCodeCard: React.FC = () => {
  const { user } = useFirebaseAuth();
  const { toast } = useToast();
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchLinkCode = async () => {
      try {
        setLoading(true);
        
        // Check if user already has a link code in Firestore
        const userLinkRef = doc(db, "userLinks", user.uid);
        const linkDoc = await getDoc(userLinkRef);
        
        if (linkDoc.exists() && linkDoc.data().link_code) {
          setLinkCode(linkDoc.data().link_code);
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
  }, [user, toast]);

  // Generate a random link code
  const generateRandomCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateNewLinkCode = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      const newLinkCode = generateRandomCode();
      
      const userLinkRef = doc(db, "userLinks", user.uid);
      const linkDoc = await getDoc(userLinkRef);
      
      if (linkDoc.exists()) {
        // Update existing document
        await updateDoc(userLinkRef, { 
          link_code: newLinkCode,
          updated_at: new Date()
        });
      } else {
        // Create new document
        await setDoc(userLinkRef, {
          user_id: user.uid,
          link_code: newLinkCode,
          created_at: new Date()
        });
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
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
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
