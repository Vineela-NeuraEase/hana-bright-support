
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddTaskCardProps {
  userId: string;
  onTaskAdded: () => void;
}

export const AddTaskCard: React.FC<AddTaskCardProps> = ({ userId, onTaskAdded }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;
    
    try {
      setIsAdding(true);
      
      const { error } = await supabase
        .from('tasks')
        .insert([
          { 
            title: taskTitle,
            user_id: userId,
            status: 'pending',
            priority: 'medium'
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Task added",
        description: "Task was successfully assigned to the user",
      });
      
      setTaskTitle('');
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Task</CardTitle>
        <CardDescription>Assign a new task to this user</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Enter task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleAddTask} 
            disabled={!taskTitle.trim() || isAdding}
          >
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
