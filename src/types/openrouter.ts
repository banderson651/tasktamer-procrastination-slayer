
export interface OpenRouterModels {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  top_provider: {
    id: string;
    name: string;
  };
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  name?: string;
}

export interface OpenRouterCompletionRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface OpenRouterCompletionChoice {
  index: number;
  message: OpenRouterMessage;
  finish_reason: string;
}

export interface OpenRouterCompletionResponse {
  id: string;
  choices: OpenRouterCompletionChoice[];
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterCredentials {
  apiKey: string;
  isValid: boolean;
  lastValidated?: Date;
}
