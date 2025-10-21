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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { problemText, imageData, subject } = await req.json();
    
    if (!problemText && !imageData) {
      throw new Error('Either problem text or image is required');
    }

    console.log('Solving problem:', { subject, hasImage: !!imageData });

    const systemPrompt = `You are an expert problem solver and tutor specializing in ${subject || 'all subjects'}. 

Your approach:
1. UNDERSTAND: Analyze the problem carefully and identify what is being asked
2. PLAN: Break down the solution into clear, logical steps
3. SOLVE: Work through each step methodically with detailed explanations
4. VERIFY: Check your answer and explain why it's correct

Provide your response in this JSON format:
{
  "title": "Brief problem title",
  "steps": [
    {
      "step": 1,
      "description": "Step description",
      "explanation": "Detailed explanation of this step",
      "formula": "Any relevant formula (optional)"
    }
  ],
  "finalAnswer": "The final answer with units if applicable",
  "difficulty": "easy|medium|hard",
  "concepts": ["concept1", "concept2"]
}`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    if (imageData && problemText) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: problemText },
          { type: 'image_url', image_url: { url: imageData } }
        ]
      });
    } else if (imageData) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: 'Please solve this problem shown in the image. Explain each step clearly.' },
          { type: 'image_url', image_url: { url: imageData } }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: problemText
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageData ? 'gpt-4.1-2025-04-14' : 'gpt-5-mini-2025-08-07',
        messages,
        max_completion_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const solution = JSON.parse(data.choices[0].message.content);

    console.log('Problem solved successfully');

    return new Response(JSON.stringify({ solution }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in solve-problem function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: 'Please try again or contact support if the issue persists.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
