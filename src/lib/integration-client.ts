// Client library for managing user integrations

import { createClient } from '@supabase/supabase-js';
import type { UserIntegration } from './types/integrations';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export class IntegrationClient {
  private supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get all user integrations
  async getUserIntegrations(): Promise<UserIntegration[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Table might not exist yet - return empty array instead of throwing
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.log('user_integrations table does not exist yet');
          return [];
        }
        console.error('Error fetching integrations:', error);
        return []; // Return empty array instead of throwing
      }

      return data || [];
    } catch (error) {
      console.error('Unexpected error fetching integrations:', error);
      return []; // Return empty array for any unexpected errors
    }
  }

  // Get integration by provider
  async getIntegrationByProvider(provider: string): Promise<UserIntegration | null> {
    const { data, error } = await this.supabase
      .from('user_integrations')
      .select('*')
      .eq('provider', provider)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No integration found
      }
      throw new Error('Failed to fetch integration');
    }

    return data;
  }

  // Add new integration
  async addIntegration(
    provider: string,
    name: string,
    credentials: Record<string, any>
  ): Promise<UserIntegration> {
    const { data, error } = await this.supabase
      .from('user_integrations')
      .insert({
        provider,
        name,
        credentials,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding integration:', error);
      throw new Error('Failed to add integration');
    }

    return data;
  }

  // Update integration
  async updateIntegration(
    id: string,
    updates: Partial<Pick<UserIntegration, 'name' | 'credentials' | 'status'>>
  ): Promise<UserIntegration> {
    const { data, error } = await this.supabase
      .from('user_integrations')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating integration:', error);
      throw new Error('Failed to update integration');
    }

    return data;
  }

  // Delete integration
  async deleteIntegration(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_integrations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting integration:', error);
      throw new Error('Failed to delete integration');
    }
  }

  // Test integration (placeholder - implement actual tests per provider)
  async testIntegration(id: string): Promise<boolean> {
    // This would call an edge function to test the integration
    // For now, just return true
    return true;
  }
}

// Export singleton instance
export const integrationClient = new IntegrationClient();

