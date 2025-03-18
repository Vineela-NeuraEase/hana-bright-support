
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { text } = await req.json();
    
    if (!text || text.trim() === '') {
      return new Response(
        JSON.stringify({ sentiment: 'neutral', confidence: 0.7 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API to analyze sentiment
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
            content: 'You are a sentiment analysis tool. Analyze the emotional content of the following text and return ONLY ONE WORD that best represents the sentiment: "positive", "negative", "neutral", "happy", "sad", "anxious", "frustrated", or "angry".'
          },
          {
            role: 'user',
            content: text,
          }
        ],
        max_tokens: 10,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      // Fall back to simple sentiment analysis
      const sentiment = simpleAnalysis(text);
      return new Response(
        JSON.stringify({ sentiment, confidence: 0.5, fallback: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract sentiment from the OpenAI response
    let sentiment = data.choices[0].message.content.trim().toLowerCase();
    
    // Normalize the sentiment to our expected values
    if (!["positive", "negative", "neutral", "happy", "sad", "anxious", "frustrated", "angry"].includes(sentiment)) {
      // If the response is multi-word or unexpected, try to map it to our categories
      if (sentiment.includes('positive') || sentiment.includes('happy') || sentiment.includes('joy')) {
        sentiment = 'positive';
      } else if (sentiment.includes('negative') || sentiment.includes('sad') || sentiment.includes('angry') || 
                sentiment.includes('anxious') || sentiment.includes('frustrated')) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
    }

    console.log(`Analyzed sentiment for text: "${text.substring(0, 50)}..." - Result: ${sentiment}`);

    return new Response(
      JSON.stringify({ 
        sentiment, 
        confidence: 0.85,
        analyzed_text: text.substring(0, 50) + (text.length > 50 ? '...' : '') 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    
    return new Response(
      JSON.stringify({ 
        sentiment: 'neutral', 
        confidence: 0.3,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Fallback simple sentiment analysis if OpenAI call fails
function simpleAnalysis(text: string): string {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['happy', 'joy', 'wonderful', 'great', 'good', 'excellent', 'amazing',
    'love', 'enjoyed', 'positive', 'hopeful', 'peaceful', 'relaxed'];

  const negativeWords = ['sad', 'angry', 'upset', 'terrible', 'bad', 'awful', 'horrible',
    'hate', 'dislike', 'disappointed', 'stress', 'anxious', 'worried',
    'depressed', 'miserable', 'pain', 'hurt', 'frustrated'];
  
  const neutralWords = ['okay', 'fine', 'neutral', 'average', 'normal'];

  let posCount = 0;
  let negCount = 0;
  let neutralCount = 0;

  positiveWords.forEach((word) => {
    if (lowerText.includes(word)) posCount++;
  });

  negativeWords.forEach((word) => {
    if (lowerText.includes(word)) negCount++;
  });

  neutralWords.forEach((word) => {
    if (lowerText.includes(word)) neutralCount++;
  });

  if (posCount > negCount && posCount > neutralCount) return 'positive';
  if (negCount > posCount && negCount > neutralCount) return 'negative';
  return 'neutral';
}
