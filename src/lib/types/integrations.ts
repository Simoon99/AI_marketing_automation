// Integration Types and Definitions

export interface UserIntegration {
  id: string;
  user_id: string;
  provider: string;
  name: string;
  credentials: Record<string, any>;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  logo?: string; // URL to company logo
  category: 'communication' | 'ai' | 'email' | 'storage' | 'crm' | 'payment' | 'social' | 'productivity' | 'webhook';
  credentialFields: CredentialField[];
  actions: IntegrationAction[];
  popular: boolean;
}

export interface CredentialField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'textarea' | 'select';
  placeholder?: string;
  required: boolean;
  description?: string;
  options?: { label: string; value: string }[];
}

export interface IntegrationAction {
  id: string;
  name: string;
  description: string;
  parameters: ActionParameter[];
}

export interface ActionParameter {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'json';
  required: boolean;
  default?: any;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
}

// Popular Integration Definitions
export const INTEGRATIONS: IntegrationDefinition[] = [
  // AI & LLMs
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5, DALL-E, and more',
    icon: '🤖',
    logo: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg',
    category: 'ai',
    popular: true,
    credentialFields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        placeholder: 'sk-...',
        required: true,
        description: 'Get your API key from platform.openai.com',
      },
    ],
    actions: [
      {
        id: 'chat_completion',
        name: 'Chat Completion',
        description: 'Generate text using GPT models',
        parameters: [
          { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
          { key: 'model', label: 'Model', type: 'select', required: true, default: 'gpt-4-turbo-preview', options: [
            { label: 'GPT-4 Turbo', value: 'gpt-4-turbo-preview' },
            { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
          ]},
          { key: 'temperature', label: 'Temperature', type: 'number', required: false, default: 0.7 },
          { key: 'max_tokens', label: 'Max Tokens', type: 'number', required: false },
        ],
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude 3 AI models',
    icon: '🧠',
    logo: 'https://cdn.worldvectorlogo.com/logos/anthropic.svg',
    category: 'ai',
    popular: true,
    credentialFields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'message',
        name: 'Send Message',
        description: 'Send a message to Claude',
        parameters: [
          { key: 'prompt', label: 'Prompt', type: 'textarea', required: true },
          { key: 'model', label: 'Model', type: 'select', required: true, default: 'claude-3-opus-20240229', options: [
            { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
            { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
          ]},
        ],
      },
    ],
  },

  // Email
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery service',
    icon: '📧',
    logo: 'https://cdn.worldvectorlogo.com/logos/sendgrid-1.svg',
    category: 'email',
    popular: true,
    credentialFields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'send_email',
        name: 'Send Email',
        description: 'Send an email via SendGrid',
        parameters: [
          { key: 'to', label: 'To', type: 'text', required: true },
          { key: 'subject', label: 'Subject', type: 'text', required: true },
          { key: 'html', label: 'HTML Content', type: 'textarea', required: true },
          { key: 'from', label: 'From', type: 'text', required: true },
        ],
      },
    ],
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Google Gmail integration',
    icon: '📮',
    logo: 'https://cdn.worldvectorlogo.com/logos/gmail-icon.svg',
    category: 'email',
    popular: true,
    credentialFields: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'send_email',
        name: 'Send Email',
        description: 'Send an email via Gmail',
        parameters: [
          { key: 'to', label: 'To', type: 'text', required: true },
          { key: 'subject', label: 'Subject', type: 'text', required: true },
          { key: 'body', label: 'Body', type: 'textarea', required: true },
        ],
      },
      {
        id: 'read_emails',
        name: 'Read Emails',
        description: 'Read emails from Gmail',
        parameters: [
          { key: 'query', label: 'Search Query', type: 'text', required: false, placeholder: 'is:unread' },
          { key: 'max_results', label: 'Max Results', type: 'number', required: false, default: 10 },
        ],
      },
    ],
  },

  // Communication
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication platform',
    icon: '💬',
    logo: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg',
    category: 'communication',
    popular: true,
    credentialFields: [
      { key: 'bot_token', label: 'Bot Token', type: 'password', required: true, placeholder: 'xoxb-...' },
    ],
    actions: [
      {
        id: 'send_message',
        name: 'Send Message',
        description: 'Send a message to a Slack channel',
        parameters: [
          { key: 'channel', label: 'Channel', type: 'text', required: true, placeholder: '#general' },
          { key: 'text', label: 'Message', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Discord bot integration',
    icon: '🎮',
    category: 'communication',
    popular: true,
    credentialFields: [
      { key: 'bot_token', label: 'Bot Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'send_message',
        name: 'Send Message',
        description: 'Send a message to a Discord channel',
        parameters: [
          { key: 'channel_id', label: 'Channel ID', type: 'text', required: true },
          { key: 'content', label: 'Message', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Telegram bot integration',
    icon: '✈️',
    category: 'communication',
    popular: true,
    credentialFields: [
      { key: 'bot_token', label: 'Bot Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'send_message',
        name: 'Send Message',
        description: 'Send a message via Telegram',
        parameters: [
          { key: 'chat_id', label: 'Chat ID', type: 'text', required: true },
          { key: 'text', label: 'Message', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and voice communication',
    icon: '📱',
    logo: 'https://cdn.worldvectorlogo.com/logos/twilio.svg',
    category: 'communication',
    popular: true,
    credentialFields: [
      { key: 'account_sid', label: 'Account SID', type: 'text', required: true },
      { key: 'auth_token', label: 'Auth Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'send_sms',
        name: 'Send SMS',
        description: 'Send an SMS message',
        parameters: [
          { key: 'to', label: 'To Number', type: 'text', required: true, placeholder: '+1234567890' },
          { key: 'from', label: 'From Number', type: 'text', required: true },
          { key: 'body', label: 'Message', type: 'textarea', required: true },
        ],
      },
    ],
  },

  // Productivity
  {
    id: 'notion',
    name: 'Notion',
    description: 'Workspace and documentation',
    icon: '📝',
    logo: 'https://cdn.worldvectorlogo.com/logos/notion-2.svg',
    category: 'productivity',
    popular: true,
    credentialFields: [
      { key: 'api_key', label: 'Internal Integration Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'create_page',
        name: 'Create Page',
        description: 'Create a new Notion page',
        parameters: [
          { key: 'parent_id', label: 'Parent Page/Database ID', type: 'text', required: true },
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'content', label: 'Content', type: 'textarea', required: false },
        ],
      },
    ],
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Spreadsheet management',
    icon: '📊',
    logo: 'https://cdn.worldvectorlogo.com/logos/google-sheets.svg',
    category: 'productivity',
    popular: true,
    credentialFields: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'append_row',
        name: 'Append Row',
        description: 'Append a row to a sheet',
        parameters: [
          { key: 'spreadsheet_id', label: 'Spreadsheet ID', type: 'text', required: true },
          { key: 'sheet_name', label: 'Sheet Name', type: 'text', required: true },
          { key: 'values', label: 'Values (JSON array)', type: 'json', required: true },
        ],
      },
    ],
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Database and spreadsheet hybrid',
    icon: '🗃️',
    logo: 'https://cdn.worldvectorlogo.com/logos/airtable.svg',
    category: 'productivity',
    popular: true,
    credentialFields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'create_record',
        name: 'Create Record',
        description: 'Create a new record in Airtable',
        parameters: [
          { key: 'base_id', label: 'Base ID', type: 'text', required: true },
          { key: 'table_name', label: 'Table Name', type: 'text', required: true },
          { key: 'fields', label: 'Fields (JSON)', type: 'json', required: true },
        ],
      },
    ],
  },

  // CRM & Marketing
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'CRM and marketing automation',
    icon: '🎯',
    logo: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
    category: 'crm',
    popular: true,
    credentialFields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'create_contact',
        name: 'Create Contact',
        description: 'Create a new contact in HubSpot',
        parameters: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'firstname', label: 'First Name', type: 'text', required: false },
          { key: 'lastname', label: 'Last Name', type: 'text', required: false },
        ],
      },
    ],
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing platform',
    icon: '🐵',
    logo: 'https://cdn.worldvectorlogo.com/logos/mailchimp-freddie-icon.svg',
    category: 'crm',
    popular: false,
    credentialFields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'add_subscriber',
        name: 'Add Subscriber',
        description: 'Add a subscriber to a list',
        parameters: [
          { key: 'list_id', label: 'List ID', type: 'text', required: true },
          { key: 'email', label: 'Email', type: 'text', required: true },
        ],
      },
    ],
  },

  // Social Media
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Social media platform',
    icon: '🐦',
    logo: 'https://cdn.worldvectorlogo.com/logos/twitter-6.svg',
    category: 'social',
    popular: true,
    credentialFields: [
      { key: 'api_key', label: 'API Key', type: 'text', required: true },
      { key: 'api_secret', label: 'API Secret', type: 'password', required: true },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
      { key: 'access_token_secret', label: 'Access Token Secret', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'post_tweet',
        name: 'Post Tweet',
        description: 'Post a tweet',
        parameters: [
          { key: 'text', label: 'Tweet Text', type: 'textarea', required: true },
        ],
      },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking platform',
    icon: '💼',
    logo: 'https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg',
    category: 'social',
    popular: false,
    credentialFields: [
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'create_post',
        name: 'Create Post',
        description: 'Create a LinkedIn post',
        parameters: [
          { key: 'text', label: 'Post Text', type: 'textarea', required: true },
        ],
      },
    ],
  },

  // Payment & E-commerce
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing',
    icon: '💳',
    logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    category: 'payment',
    popular: true,
    credentialFields: [
      { key: 'secret_key', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_...' },
    ],
    actions: [
      {
        id: 'create_customer',
        name: 'Create Customer',
        description: 'Create a new Stripe customer',
        parameters: [
          { key: 'email', label: 'Email', type: 'text', required: true },
          { key: 'name', label: 'Name', type: 'text', required: false },
        ],
      },
    ],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'E-commerce platform',
    icon: '🛍️',
    logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
    category: 'payment',
    popular: false,
    credentialFields: [
      { key: 'shop_name', label: 'Shop Name', type: 'text', required: true, placeholder: 'myshop' },
      { key: 'access_token', label: 'Access Token', type: 'password', required: true },
    ],
    actions: [
      {
        id: 'create_product',
        name: 'Create Product',
        description: 'Create a new product',
        parameters: [
          { key: 'title', label: 'Title', type: 'text', required: true },
          { key: 'price', label: 'Price', type: 'number', required: true },
        ],
      },
    ],
  },

  // Webhooks & HTTP
  {
    id: 'webhook',
    name: 'Webhook',
    description: 'HTTP requests to any URL',
    icon: '🔗',
    category: 'webhook',
    popular: true,
    credentialFields: [],
    actions: [
      {
        id: 'http_request',
        name: 'HTTP Request',
        description: 'Make an HTTP request',
        parameters: [
          { key: 'url', label: 'URL', type: 'text', required: true },
          { key: 'method', label: 'Method', type: 'select', required: true, default: 'POST', options: [
            { label: 'GET', value: 'GET' },
            { label: 'POST', value: 'POST' },
            { label: 'PUT', value: 'PUT' },
            { label: 'DELETE', value: 'DELETE' },
          ]},
          { key: 'headers', label: 'Headers (JSON)', type: 'json', required: false },
          { key: 'body', label: 'Body (JSON)', type: 'json', required: false },
        ],
      },
    ],
  },
];

// Helper functions
export function getIntegrationById(id: string): IntegrationDefinition | undefined {
  return INTEGRATIONS.find(i => i.id === id);
}

export function getPopularIntegrations(): IntegrationDefinition[] {
  return INTEGRATIONS.filter(i => i.popular);
}

export function getIntegrationsByCategory(category: IntegrationDefinition['category']): IntegrationDefinition[] {
  return INTEGRATIONS.filter(i => i.category === category);
}

