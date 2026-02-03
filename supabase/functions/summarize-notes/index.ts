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

    const { content, summaryType = 'comprehensive' } = await req.json();
    
    if (!content) {
      throw new Error('Content is required');
    }

    console.log('Summarizing notes, type:', summaryType);

    const systemPrompt = `You are an expert note summarizer for students. Create a ${summaryType} summary of the provided content.

Summary types:
- "brief": 2-3 sentence overview
- "comprehensive": Detailed summary with all key points
- "bullet_points": Key points as bullet list
- "study_guide": Formatted for studying with sections

Return your response as a JSON object:
{
  "summary": {
    "title": "Generated title for the notes",
    "type": "${summaryType}",
    "content": "The summary text (use markdown formatting)",
    "keyPoints": ["Key point 1", "Key point 2", ...],
    "concepts": ["Main concept 1", "Main concept 2", ...],
    "vocabulary": [
      {"term": "Term", "definition": "Definition"}
    ],
    "wordCount": {
      "original": number,
      "summary": number
    }
  }
}`;

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
          { role: 'user', content: `Please summarize the following notes:\n\n${content}` }
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
    const summary = JSON.parse(data.choices[0].message.content);

    console.log('Notes summarized successfully');

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in summarize-notes function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
