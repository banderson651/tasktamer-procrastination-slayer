
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OpenRouterCredentials } from '@/types/openrouter';

interface OpenRouterState {
  credentials: OpenRouterCredentials;
  setApiKey: (apiKey: string) => void;
  validateApiKey: (isValid: boolean) => void;
  clearCredentials: () => void;
}

export const useOpenRouterStore = create<OpenRouterState>()(
  persist(
    (set) => ({
      credentials: {
        apiKey: '',
        isValid: false,
      },
      setApiKey: (apiKey: string) => {
        set((state) => ({
          credentials: {
            ...state.credentials,
            apiKey,
          },
        }));
      },
      validateApiKey: (isValid: boolean) => {
        set((state) => ({
          credentials: {
            ...state.credentials,
            isValid,
            lastValidated: isValid ? new Date() : state.credentials.lastValidated,
          },
        }));
      },
      clearCredentials: () => {
        set({
          credentials: {
            apiKey: '',
            isValid: false,
            lastValidated: undefined,
          },
        });
      },
    }),
    {
      name: 'openrouter-credentials',
    }
  )
);
