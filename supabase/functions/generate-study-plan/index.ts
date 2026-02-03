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

    const { 
      subjects, 
      deadline, 
      hoursPerDay = 2, 
      learningStyle = 'balanced',
      currentLevel = 'intermediate'
    } = await req.json();
    
    if (!subjects || subjects.length === 0) {
      throw new Error('At least one subject is required');
    }

    console.log('Generating study plan for:', subjects);

    const today = new Date().toISOString().split('T')[0];
    
    const systemPrompt = `You are an expert educational planner who creates personalized study plans. Create a detailed study plan based on the following:

- Subjects: ${subjects.join(', ')}
- Deadline: ${deadline || 'No specific deadline (ongoing study)'}
- Study hours per day: ${hoursPerDay}
- Learning style: ${learningStyle} (visual, auditory, reading, kinesthetic, balanced)
- Current level: ${currentLevel}
- Today's date: ${today}

Return your response as a JSON object:
{
  "studyPlan": {
    "title": "Personalized Study Plan",
    "overview": "Brief description of the plan",
    "totalDays": number,
    "hoursPerDay": ${hoursPerDay},
    "subjects": ${JSON.stringify(subjects)},
    "phases": [
      {
        "name": "Phase name",
        "duration": "X days/weeks",
        "focus": "Main focus of this phase",
        "goals": ["Goal 1", "Goal 2"]
      }
    ],
    "weeklySchedule": [
      {
        "day": "Monday",
        "sessions": [
          {
            "subject": "Subject name",
            "duration": "1 hour",
            "activity": "What to study",
            "resources": ["Suggested resources"]
          }
        ]
      }
    ],
    "milestones": [
      {
        "week": 1,
        "goals": ["What to achieve by this week"],
        "assessment": "How to test progress"
      }
    ],
    "tips": ["Study tip 1", "Study tip 2"],
    "breakSchedule": {
      "shortBreak": "5-10 min every 25 min",
      "longBreak": "15-30 min every 2 hours"
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
          { role: 'user', content: `Create a study plan for: ${subjects.join(', ')}` }
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
    const studyPlan = JSON.parse(data.choices[0].message.content);

    console.log('Study plan generated successfully');

    return new Response(JSON.stringify(studyPlan), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-study-plan function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
