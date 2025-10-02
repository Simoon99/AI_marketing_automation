// Agent Types

export type AgentStatus = 'active' | 'paused' | 'error';
export type TriggerType = 'manual' | 'scheduled' | 'webhook';
export type ExecutionStatus = 'success' | 'failed' | 'running';
export type StepType = 'fetch' | 'process' | 'action';

export interface AgentTrigger {
  type: TriggerType;
  schedule?: string; // Cron expression
  webhookUrl?: string;
}

export interface AgentIntegration {
  provider: string; // 'gmail', 'slack', 'twitter', etc.
  actions: string[]; // ['read_emails', 'send_message']
}

export interface AgentStep {
  type: StepType;
  integration?: string;
  action: string;
  params: Record<string, any>;
}

export interface LLMConfig {
  model: 'gpt-4' | 'gpt-4-turbo' | 'claude-3-5-sonnet';
  systemPrompt: string;
  temperature: number;
}

export interface AgentConfig {
  id?: string;
  name: string;
  description: string;
  trigger: AgentTrigger;
  integrations: AgentIntegration[];
  steps: AgentStep[];
  llm?: LLMConfig;
}

export interface Agent {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  prompt: string;
  config: AgentConfig;
  status: AgentStatus;
  trigger_type: TriggerType;
  schedule: string | null;
  integrations: AgentIntegration[];
  created_at: string;
  updated_at: string;
}

export interface AgentExecution {
  id: string;
  agent_id: string;
  user_id: string;
  status: ExecutionStatus;
  input: Record<string, any> | null;
  output: Record<string, any> | null;
  error: string | null;
  duration_ms: number | null;
  executed_at: string;
}

export interface CreateAgentRequest {
  prompt: string;
}

export interface CreateAgentResponse {
  success: boolean;
  agent?: Agent;
  error?: string;
}

export interface ExecuteAgentRequest {
  agent_id: string;
  input?: Record<string, any>;
}

export interface ExecuteAgentResponse {
  success: boolean;
  execution?: AgentExecution;
  error?: string;
}

// Integration providers
export type IntegrationProvider = 
  | 'gmail'
  | 'sendgrid'
  | 'slack'
  | 'twitter'
  | 'hubspot'
  | 'notion'
  | 'airtable'
  | 'webhook';

export interface IntegrationCredentials {
  id: string;
  user_id: string;
  provider: IntegrationProvider;
  credentials: Record<string, any>; // Encrypted
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

