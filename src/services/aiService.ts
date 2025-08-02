import type { AIProvider } from "@/components/Chat/ApiKeyModal";

export interface AIResponse {
  content: string;
  error?: string;
}

class AIService {
  private apiKey: string = '';
  private provider: AIProvider = 'openai';

  setCredentials(apiKey: string, provider: AIProvider) {
    this.apiKey = apiKey;
    this.provider = provider;
    // Store in localStorage for persistence
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ai_provider', provider);
  }

  loadCredentials() {
    const storedKey = localStorage.getItem('ai_api_key');
    const storedProvider = localStorage.getItem('ai_provider') as AIProvider;
    
    if (storedKey && storedProvider) {
      this.apiKey = storedKey;
      this.provider = storedProvider;
      return true;
    }
    return false;
  }

  hasCredentials(): boolean {
    return !!this.apiKey && !!this.provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  clearCredentials() {
    this.apiKey = '';
    this.provider = 'openai';
    localStorage.removeItem('ai_api_key');
    localStorage.removeItem('ai_provider');
  }

  async sendMessage(message: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<AIResponse> {
    if (!this.hasCredentials()) {
      throw new Error('No API credentials configured');
    }

    try {
      switch (this.provider) {
        case 'openai':
          return await this.callOpenAI(message, conversationHistory);
        case 'anthropic':
          return await this.callAnthropic(message, conversationHistory);
        case 'gemini':
          return await this.callGemini(message, conversationHistory);
        default:
          throw new Error(`Unsupported provider: ${this.provider}`);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  private async callOpenAI(message: string, history: Array<{role: string, content: string}>): Promise<AIResponse> {
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant. Be concise, friendly, and informative.' },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || 'No response received'
    };
  }

  private async callAnthropic(message: string, history: Array<{role: string, content: string}>): Promise<AIResponse> {
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        messages: messages,
        system: 'You are a helpful AI assistant. Be concise, friendly, and informative.'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content[0]?.text || 'No response received'
    };
  }

  private async callGemini(message: string, history: Array<{role: string, content: string}>): Promise<AIResponse> {
    // Convert conversation history to Gemini format
    const contents = [];
    
    for (const msg of history) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
        systemInstruction: {
          parts: [{ text: 'You are a helpful AI assistant. Be concise, friendly, and informative.' }]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received'
    };
  }
}

export const aiService = new AIService();