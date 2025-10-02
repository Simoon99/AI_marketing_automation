/**
 * Base Integration Class
 * 
 * All integrations extend this class to provide a consistent interface
 */

export interface IntegrationCredentials {
  [key: string]: string;
}

export interface IntegrationAction {
  name: string;
  description: string;
  params: Record<string, any>;
}

export abstract class BaseIntegration {
  protected credentials: IntegrationCredentials;
  protected userId: string;

  constructor(userId: string, credentials: IntegrationCredentials) {
    this.userId = userId;
    this.credentials = credentials;
  }

  /**
   * Validate that credentials are valid
   */
  abstract validateCredentials(): Promise<boolean>;

  /**
   * Get list of available actions
   */
  abstract getAvailableActions(): IntegrationAction[];

  /**
   * Execute an action
   */
  abstract executeAction(action: string, params: Record<string, any>): Promise<any>;

  /**
   * Get display name for this integration
   */
  abstract getDisplayName(): string;

  /**
   * Get icon/emoji for this integration
   */
  abstract getIcon(): string;
}

