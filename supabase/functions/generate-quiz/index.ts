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

    const { topic, difficulty = 'medium', questionCount = 10, questionTypes = ['multiple_choice', 'true_false'] } = await req.json();
    
    if (!topic) {
      throw new Error('Topic is required');
    }

    console.log('Generating quiz for:', topic);

    const systemPrompt = `You are an expert quiz creator for educational purposes. Generate a quiz with exactly ${questionCount} questions about "${topic}" at ${difficulty} difficulty level.

Include these question types: ${questionTypes.join(', ')}

Return your response as a JSON object:
{
  "quiz": {
    "title": "Quiz title",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "totalQuestions": ${questionCount},
    "estimatedTime": "X minutes",
    "questions": [
      {
        "id": 1,
        "type": "multiple_choice|true_false|short_answer",
        "question": "Question text",
        "options": ["A", "B", "C", "D"] (for multiple choice only),
        "correctAnswer": "The correct answer",
        "explanation": "Why this is correct",
        "points": 10
      }
    ]
  }
}

For multiple_choice: provide 4 options
For true_false: correctAnswer should be "True" or "False"
For short_answer: no options needed`;

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
          { role: 'user', content: `Create a ${difficulty} difficulty quiz about: ${topic}` }
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
    const quiz = JSON.parse(data.choices[0].message.content);

    console.log('Quiz generated successfully');

    return new Response(JSON.stringify(quiz), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-quiz function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
