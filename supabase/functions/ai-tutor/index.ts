import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const { message, sessionId } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Received message:', message);
    console.log('Session ID:', sessionId);

    const systemPrompt = `You are StudySmart AI, an expert educational tutor designed to help students learn effectively. You are knowledgeable across all academic subjects including:

- Mathematics (algebra, calculus, geometry, statistics)
- Sciences (physics, chemistry, biology, earth science)
- Humanities (history, literature, philosophy, languages)
- Social Sciences (psychology, sociology, economics, political science)
- Computer Science & Technology
- Arts & Creative Subjects

Your teaching approach:
1. PERSONALIZED: Adapt explanations to the student's level and learning style
2. CLEAR: Break down complex concepts into understandable steps
3. ENCOURAGING: Maintain a positive, supportive tone
4. INTERACTIVE: Ask questions to ensure understanding
5. PRACTICAL: Provide real-world examples and applications

Guidelines:
- Always explain concepts clearly and step-by-step
- Use analogies and examples to make difficult topics accessible
- Encourage critical thinking by asking follow-up questions
- Provide study tips and learning strategies when appropriate
- If a topic is outside your expertise, admit it and suggest resources
- Keep responses focused and educational
- Be patient and understanding of different learning paces

Remember: Your goal is to help students learn and understand, not just provide answers.`;

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
          { role: 'user', content: message }
        ],
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
      
      throw new Error(`AI Gateway error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-tutor function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      details: 'Please try again or contact support if the issue persists.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});