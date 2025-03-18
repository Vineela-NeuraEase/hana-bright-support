
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { text, style, type } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    let promptContent;

    if (type === "formalizer") {
      promptContent = `Rewrite the following text in a ${style || "professional"} tone, preserving the original meaning but adjusting the style appropriately:\n\n${text}`;
    } else if (type === "judge") {
      promptContent = `Analyze the tone, sentiment, and emotional context of the following message. Provide a brief summary of how the message comes across (e.g., friendly, annoyed, confused, etc.) and note any key phrases that indicate this tone:\n\n${text}`;
    } else {
      throw new Error('Invalid transformation type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: type === "formalizer" 
              ? 'You are a helpful assistant that rewrites text in different styles while preserving the original meaning.'
              : 'You are a helpful assistant that analyzes the tone and sentiment of messages. Be concise but insightful.'
          },
          { role: 'user', content: promptContent }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const transformedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      result: transformedText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in transform-text function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
