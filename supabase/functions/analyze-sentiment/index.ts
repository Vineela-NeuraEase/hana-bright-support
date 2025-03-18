
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const { text } = await req.json()
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // In a production environment, you would call an actual AI service here
    // For now, we'll use a simple algorithm
    const sentiment = simpleSentimentAnalysis(text)
    
    return new Response(
      JSON.stringify({ 
        sentiment, 
        confidence: 0.75, 
        text 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

function simpleSentimentAnalysis(text: string): string {
  const lowerText = text.toLowerCase()
  
  const positiveWords = [
    'happy', 'joy', 'wonderful', 'great', 'good', 'excellent', 'amazing',
    'love', 'enjoyed', 'positive', 'hopeful', 'peaceful', 'relaxed',
  ]

  const negativeWords = [
    'sad', 'angry', 'upset', 'terrible', 'bad', 'awful', 'horrible',
    'hate', 'dislike', 'disappointed', 'stress', 'anxious', 'worried',
    'depressed', 'miserable', 'pain', 'hurt',
  ]

  let posCount = 0
  let negCount = 0

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      posCount += matches.length
    }
  })

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      negCount += matches.length
    }
  })

  if (posCount > negCount) return 'positive'
  if (negCount > posCount) return 'negative'
  return 'neutral'
}
