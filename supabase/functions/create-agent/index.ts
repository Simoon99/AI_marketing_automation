// @deno-types="npm:@supabase/supabase-js@^2.39.3"
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateAgentRequest {
  prompt: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request
    const { prompt }: CreateAgentRequest = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt is required')
    }

    console.log('🤖 Creating agent from prompt:', prompt)

    // Call OpenAI to generate agent configuration
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const systemPrompt = `You are an AI agent configuration generator. Your job is to analyze user prompts and generate executable agent configurations.

IMPORTANT: Your response must be ONLY valid JSON, no markdown, no explanations, no code blocks.

Given a user prompt, generate a JSON configuration with:
1. name: A clear, concise agent name
2. description: One sentence description
3. trigger: { type: 'manual' | 'scheduled' | 'webhook', schedule?: cron expression }
4. integrations: Array of { provider: string, actions: string[] }
5. steps: Array of execution steps with type, action, params
6. llm: Optional LLM config if AI processing is needed

Available integrations:
- gmail: read_emails, send_email, search_emails
- sendgrid: send_email
- slack: send_message, read_channels
- twitter: search_mentions, post_tweet
- webhook: http_request

Available step types:
- fetch: Get data from an integration
- process: Process data (with or without LLM)
- action: Perform an action via integration

Example output:
{
  "name": "Email Summarizer",
  "description": "Summarizes unread emails daily",
  "trigger": { "type": "scheduled", "schedule": "0 8 * * *" },
  "integrations": [
    { "provider": "gmail", "actions": ["read_emails"] },
    { "provider": "sendgrid", "actions": ["send_email"] }
  ],
  "steps": [
    {
      "type": "fetch",
      "integration": "gmail",
      "action": "read_emails",
      "params": { "filter": "is:unread", "limit": 20 }
    },
    {
      "type": "process",
      "action": "summarize",
      "params": {
        "use_llm": true,
        "llm_prompt": "Summarize these emails by category and priority"
      }
    },
    {
      "type": "action",
      "integration": "sendgrid",
      "action": "send_email",
      "params": {
        "to": "user@example.com",
        "subject": "Daily Email Summary",
        "body": "{{summary}}"
      }
    }
  ],
  "llm": {
    "model": "gpt-4",
    "systemPrompt": "You are an email summarization assistant",
    "temperature": 0.3
  }
}

REMEMBER: Return ONLY the JSON object, nothing else.`

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to generate agent configuration')
    }

    const openaiData = await openaiResponse.json()
    const configText = openaiData.choices[0].message.content
    
    console.log('📝 Generated config:', configText)

    // Parse the generated configuration
    const config = JSON.parse(configText)

    // Validate required fields
    if (!config.name || !config.description || !config.trigger || !config.steps) {
      throw new Error('Invalid agent configuration generated')
    }

    // Insert agent into database
    const { data: agent, error: insertError } = await supabaseClient
      .from('agents')
      .insert({
        user_id: user.id,
        name: config.name,
        description: config.description,
        prompt: prompt,
        config: config,
        trigger_type: config.trigger.type,
        schedule: config.trigger.schedule || null,
        integrations: config.integrations || [],
        status: 'active',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      throw new Error('Failed to save agent')
    }

    console.log('✅ Agent created:', agent.id)

    return new Response(
      JSON.stringify({
        success: true,
        agent: agent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
