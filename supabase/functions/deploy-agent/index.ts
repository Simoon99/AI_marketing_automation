// @deno-types="npm:@types/cors@^2.8.5"
import cors from 'npm:cors@^2.8.5'
// @deno-types="npm:@supabase/supabase-js@^2.39.3"
import { createClient } from 'npm:@supabase/supabase-js@^2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeployAgentRequest {
  prompt: string;
  config: any;
}

Deno.serve(async (req) => {
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
    const { prompt, config }: DeployAgentRequest = await req.json()

    if (!prompt || !config) {
      throw new Error('Prompt and config are required')
    }

    console.log('🚀 Deploying agent:', config.name)

    // Validate configuration
    if (!config.name || !config.description || !config.trigger || !config.steps) {
      throw new Error('Invalid agent configuration')
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
        is_draft: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      throw new Error('Failed to save agent')
    }

    console.log('✅ Agent deployed:', agent.id)

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

