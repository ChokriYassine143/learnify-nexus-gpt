import axios from 'axios';

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/';
const MODEL_NAME = 'mistralai/Mixtral-8x7B-Instruct-v0.1';
const API_KEY = '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';

class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${HUGGINGFACE_API_URL}${MODEL_NAME}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.3,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data[0].generated_text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }

  formatPrompt(userMessage: string): string {
    return `Responde de forma breve y directa: ${userMessage}`;
  }
}

export const aiService = new AIService(); 