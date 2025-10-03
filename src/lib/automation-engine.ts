import { createClient } from '@supabase/supabase-js';
import type {
  Agent,
  AgentExecution,
  CreateAgentRequest,
  CreateAgentResponse,
  ExecuteAgentRequest,
  ExecuteAgentResponse,
} from './types/agent';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Automation Engine Client
 * 
 * Provides methods to create, execute, and manage AI agents
 */
export class AutomationEngine {
  /**
   * Generate agent configuration from a prompt (draft mode)
   * This doesn't create the agent in the database yet
   */
  async generateAgentConfig(prompt: string): Promise<{ success: boolean; config?: any; error?: string }> {
    try {
      console.log('🔍 Generating agent configuration from prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('generate-agent-config', {
        body: { prompt },
      });

      if (error) {
        console.error('Failed to generate config:', error);
        return {
          success: false,
          error: error.message || 'Failed to generate configuration',
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Unknown error',
        };
      }

      console.log('✅ Configuration generated');

      return {
        success: true,
        config: data.config,
      };
    } catch (error: any) {
      console.error('Error generating config:', error);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      };
    }
  }

  /**
   * Deploy an agent with a customized configuration
   */
  async deployAgent(prompt: string, config: any): Promise<CreateAgentResponse> {
    try {
      console.log('🚀 Deploying agent with customized config');

      const { data, error } = await supabase.functions.invoke('deploy-agent', {
        body: { prompt, config },
      });

      if (error) {
        console.error('Failed to deploy agent:', error);
        return {
          success: false,
          error: error.message || 'Failed to deploy agent',
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Unknown error',
        };
      }

      console.log('✅ Agent deployed:', data.agent.id);

      return {
        success: true,
        agent: data.agent,
      };
    } catch (error: any) {
      console.error('Error deploying agent:', error);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      };
    }
  }

  /**
   * Create a new agent from a natural language prompt (direct creation - legacy)
   */
  async createAgent(prompt: string): Promise<CreateAgentResponse> {
    try {
      console.log('🤖 Creating agent from prompt:', prompt);

      const { data, error } = await supabase.functions.invoke('create-agent', {
        body: { prompt },
      });

      if (error) {
        console.error('Failed to create agent:', error);
        return {
          success: false,
          error: error.message || 'Failed to create agent',
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Unknown error',
        };
      }

      console.log('✅ Agent created:', data.agent.id);

      return {
        success: true,
        agent: data.agent,
      };
    } catch (error: any) {
      console.error('Error creating agent:', error);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      };
    }
  }

  /**
   * Save agent directly to database (no edge function)
   */
  async saveAgent(config: any): Promise<CreateAgentResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
        };
      }

      const agentData = {
        user_id: user.id,
        name: config.name || 'Untitled Agent',
        description: config.description || '',
        prompt: `Visual agent: ${config.name}`,
        config: config,
        trigger_type: config.trigger_type || 'manual',
        schedule: config.schedule || null,
        integrations: config.integrations || [],
        status: 'active',
      };

      const { data, error } = await supabase
        .from('agents')
        .insert([agentData])
        .select()
        .single();

      if (error) {
        console.error('Failed to save agent:', error);
        return {
          success: false,
          error: error.message || 'Failed to save agent',
        };
      }

      return {
        success: true,
        agent: data,
      };
    } catch (error: any) {
      console.error('Error saving agent:', error);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      };
    }
  }

  /**
   * Execute an agent
   */
  async executeAgent(
    agentId: string,
    input?: Record<string, any>
  ): Promise<ExecuteAgentResponse> {
    try {
      console.log('🚀 Executing agent:', agentId);

      const { data, error } = await supabase.functions.invoke('execute-agent', {
        body: {
          agent_id: agentId,
          input,
        },
      });

      if (error) {
        console.error('Failed to execute agent:', error);
        return {
          success: false,
          error: error.message || 'Failed to execute agent',
        };
      }

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Execution failed',
        };
      }

      console.log('✅ Agent executed successfully');

      return {
        success: true,
        execution: data.execution,
      };
    } catch (error: any) {
      console.error('Error executing agent:', error);
      return {
        success: false,
        error: error.message || 'Unexpected error',
      };
    }
  }

  /**
   * Get all agents for the current user
   */
  async getAgents(): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Table might not exist yet - return empty array instead of throwing
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('agents table does not exist yet');
          return [];
        }
        console.log('Failed to fetch agents:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.log('Error fetching agents:', error);
      return [];
    }
  }

  /**
   * Get a specific agent by ID
   */
  async getAgent(agentId: string): Promise<Agent | null> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', agentId)
        .single();

      if (error) {
        console.error('Failed to fetch agent:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching agent:', error);
      return null;
    }
  }

  /**
   * Update agent status
   */
  async updateAgentStatus(
    agentId: string,
    status: 'active' | 'paused' | 'error'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ status })
        .eq('id', agentId);

      if (error) {
        console.error('Failed to update agent status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating agent status:', error);
      return false;
    }
  }

  /**
   * Delete an agent
   */
  async deleteAgent(agentId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('agents').delete().eq('id', agentId);

      if (error) {
        console.error('Failed to delete agent:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting agent:', error);
      return false;
    }
  }

  /**
   * Get execution history for an agent
   */
  async getExecutions(agentId: string, limit = 50): Promise<AgentExecution[]> {
    try {
      const { data, error } = await supabase
        .from('agent_executions')
        .select('*')
        .eq('agent_id', agentId)
        .order('executed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch executions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching executions:', error);
      return [];
    }
  }

  /**
   * Get recent executions across all agents
   */
  async getRecentExecutions(limit = 20): Promise<AgentExecution[]> {
    try {
      const { data, error } = await supabase
        .from('agent_executions')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch recent executions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent executions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const automationEngine = new AutomationEngine();
