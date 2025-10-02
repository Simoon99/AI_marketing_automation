// @deno-types="https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getIntegrationHandler } from '../_shared/integrations.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExecuteAgentRequest {
  agent_id: string;
  input?: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { agent_id, input }: ExecuteAgentRequest = await req.json()

    if (!agent_id) {
      throw new Error('agent_id is required')
    }

    console.log(`🚀 Executing agent: ${agent_id}`)

    // Get agent from database
    const { data: agent, error: agentError } = await supabaseClient
      .from('agents')
      .select('*')
      .eq('id', agent_id)
      .eq('user_id', user.id)
      .single()

    if (agentError || !agent) {
      throw new Error('Agent not found')
    }

    if (agent.status !== 'active') {
      throw new Error(`Agent is ${agent.status}`)
    }

    // Create execution record
    const { data: execution, error: execError } = await supabaseClient
      .from('agent_executions')
      .insert({
        agent_id: agent_id,
        user_id: user.id,
        status: 'running',
        input: input || null,
      })
      .select()
      .single()

    if (execError) {
      throw new Error('Failed to create execution record')
    }

    console.log(`📝 Execution created: ${execution.id}`)

    try {
      // Fetch user integrations
      const { data: userIntegrations, error: integrationsError } = await supabaseClient
        .from('user_integrations')
        .select('*')
        .eq('status', 'active')

      if (integrationsError) {
        console.warn('Failed to fetch integrations:', integrationsError)
      }

      const integrationsMap = new Map()
      if (userIntegrations) {
        userIntegrations.forEach((integration: any) => {
          integrationsMap.set(integration.provider, integration.credentials)
        })
      }

      // Execute agent steps
      const config = agent.config
      let stepOutput: any = input || {}

      for (let i = 0; i < config.steps.length; i++) {
        const step = config.steps[i]
        console.log(`  Step ${i + 1}/${config.steps.length}: ${step.type} - ${step.action}`)

        // Execute step based on type
        if (step.type === 'fetch') {
          stepOutput = await executeFetchStep(step, stepOutput, integrationsMap)
        } else if (step.type === 'process') {
          stepOutput = await executeProcessStep(step, stepOutput, config.llm, integrationsMap)
        } else if (step.type === 'action') {
          stepOutput = await executeActionStep(step, stepOutput, integrationsMap)
        }
      }

      const duration = Date.now() - startTime

      // Update execution as success
      await supabaseClient
        .from('agent_executions')
        .update({
          status: 'success',
          output: stepOutput,
          duration_ms: duration,
        })
        .eq('id', execution.id)

      console.log(`✅ Agent executed successfully in ${duration}ms`)

      return new Response(
        JSON.stringify({
          success: true,
          execution: {
            ...execution,
            status: 'success',
            output: stepOutput,
            duration_ms: duration,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } catch (stepError: any) {
      const duration = Date.now() - startTime

      // Update execution as failed
      await supabaseClient
        .from('agent_executions')
        .update({
          status: 'failed',
          error: stepError.message,
          duration_ms: duration,
        })
        .eq('id', execution.id)

      throw stepError
    }
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

// Step execution functions
async function executeFetchStep(step: any, context: any, integrations: Map<string, any>): Promise<any> {
  console.log(`    Fetching from ${step.integration}...`)
  
  // Check if user has the required integration
  if (step.integration && !integrations.has(step.integration)) {
    throw new Error(`Integration ${step.integration} not configured. Please add it in Manage Integrations.`)
  }

  // Get the integration handler
  const handler = getIntegrationHandler(step.integration, step.action)
  
  if (!handler) {
    throw new Error(`Action ${step.action} not supported for ${step.integration}`)
  }

  // Get credentials
  const credentials = integrations.get(step.integration)

  // Execute the integration
  try {
    const result = await handler(credentials, step.params || {}, context)
    return result
  } catch (error: any) {
    console.error(`Integration error:`, error)
    throw new Error(`Failed to execute ${step.integration}.${step.action}: ${error.message}`)
  }
}

async function executeProcessStep(step: any, context: any, llmConfig?: any, integrations?: Map<string, any>): Promise<any> {
  console.log(`    Processing data...`)

  // If LLM processing is needed
  if (step.params?.use_llm || llmConfig) {
    // Try to get OpenAI API key from user integrations first, fallback to env
    let openaiApiKey = integrations?.get('openai')?.api_key
    if (!openaiApiKey) {
      openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    }
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured. Please add OpenAI integration.')
    }

    const prompt = step.params?.llm_prompt || 'Process this data'
    const contextStr = JSON.stringify(context, null, 2)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: llmConfig?.model || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: llmConfig?.systemPrompt || 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: `${prompt}\n\nContext: ${contextStr}`,
          },
        ],
        temperature: llmConfig?.temperature || 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('LLM processing failed')
    }

    const data = await response.json()
    const llmOutput = data.choices[0].message.content

    return {
      ...context,
      processed_data: llmOutput,
      llm_response: llmOutput,
    }
  }

  // Simple processing without LLM
  return {
    ...context,
    processed: true,
  }
}

async function executeActionStep(step: any, context: any, integrations: Map<string, any>): Promise<any> {
  console.log(`    Executing action: ${step.action}...`)

  // Check if user has the required integration
  if (step.integration && !integrations.has(step.integration)) {
    throw new Error(`Integration ${step.integration} not configured. Please add it in Manage Integrations.`)
  }

  // Get the integration handler
  const handler = getIntegrationHandler(step.integration, step.action)
  
  if (!handler) {
    throw new Error(`Action ${step.action} not supported for ${step.integration}`)
  }

  // Get credentials
  const credentials = integrations.get(step.integration)

  // Execute the integration
  try {
    const result = await handler(credentials, step.params || {}, context)
    return result
  } catch (error: any) {
    console.error(`Integration error:`, error)
    throw new Error(`Failed to execute ${step.integration}.${step.action}: ${error.message}`)
  }
}
