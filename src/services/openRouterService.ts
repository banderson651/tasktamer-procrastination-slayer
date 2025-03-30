
import { OpenRouterCompletionRequest, OpenRouterCompletionResponse, OpenRouterModels } from '@/types/openrouter';
import { toast } from 'sonner';

export const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'TaskTamer App'
    };
  }

  async validateApiKey(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to validate API key: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  async getModels(): Promise<OpenRouterModels[]> {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch models:', error);
      toast.error('Failed to fetch OpenRouter models');
      throw error;
    }
  }

  async createCompletion(request: OpenRouterCompletionRequest): Promise<OpenRouterCompletionResponse> {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `Failed with status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Completion request failed:', error);
      toast.error(`OpenRouter request failed: ${(error as Error).message}`);
      throw error;
    }
  }
}

// Create a singleton instance that can be updated with new API keys
let openRouterService: OpenRouterService | null = null;

export const getOpenRouterService = (apiKey: string): OpenRouterService => {
  if (!openRouterService || openRouterService.apiKey !== apiKey) {
    openRouterService = new OpenRouterService(apiKey);
  }
  return openRouterService;
};
