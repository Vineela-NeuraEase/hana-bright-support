
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Parse request body
    const { task, spiciness = 3 } = await req.json();

    if (!task) {
      throw new Error('Task title is required');
    }

    // Define how detailed the breakdown should be based on spiciness level
    const detailLevel = spiciness <= 2 ? 'basic' : spiciness <= 4 ? 'moderate' : 'detailed';
    const stepCount = spiciness <= 2 ? '2-3' : spiciness <= 4 ? '4-5' : '6-8';

    // Prepare OpenAI request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert in breaking down tasks into manageable steps for autistic individuals. 
                      Create a ${detailLevel} breakdown with ${stepCount} steps. 
                      The steps should be clear, concise, and follow a logical sequence.`
          },
          {
            role: 'user',
            content: `Break down this task into steps: "${task}"`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Process the content to extract steps
    let steps: {title: string, completed: boolean}[] = [];
    
    // Try to extract steps from the content
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // Try to capture steps with various formats (1. Step, - Step, Step 1:, etc.)
    const stepRegex = /^(?:\d+\.|\-|\*|Step \d+:|\(\d+\))\s*(.+)$/i;
    
    for (const line of lines) {
      const match = line.match(stepRegex);
      if (match) {
        steps.push({
          title: match[1].trim(),
          completed: false
        });
      }
    }

    // If no steps were detected with the regex, just split by newlines
    if (steps.length === 0) {
      steps = lines.map(line => ({
        title: line.trim(),
        completed: false
      }));
    }

    console.log(`Generated ${steps.length} steps for task: ${task}`);
    
    return new Response(JSON.stringify({ 
      steps,
      original_response: content // Including the original response for debugging
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in break-down-task function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
