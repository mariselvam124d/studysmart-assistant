import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const { topic, content, count = 10 } = await req.json();
    
    if (!topic && !content) {
      throw new Error('Either topic or content is required');
    }

    console.log('Generating flashcards for:', topic || 'provided content');

    const systemPrompt = `You are an expert educator who creates effective study flashcards. Generate exactly ${count} flashcards based on the provided topic or content.

Each flashcard should:
1. Have a clear, concise question on the front
2. Have a comprehensive but brief answer on the back
3. Cover different aspects of the topic
4. Progress from basic to more advanced concepts

Return your response as a JSON object with this structure:
{
  "flashcards": [
    {
      "id": 1,
      "front": "Question text here",
      "back": "Answer text here",
      "difficulty": "easy|medium|hard"
    }
  ],
  "topic": "Main topic name",
  "totalCards": number
}`;

    const userMessage = content 
      ? `Create flashcards from this content:\n\n${content}`
      : `Create flashcards about: ${topic}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI Gateway error:', errorData);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to your workspace.');
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const flashcards = JSON.parse(data.choices[0].message.content);

    console.log('Flashcards generated successfully');

    return new Response(JSON.stringify(flashcards), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
