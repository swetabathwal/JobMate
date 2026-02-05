import { Injectable } from '@angular/core';
// FIX: Use GenerateContentParameters instead of the deprecated GenerateContentRequest.
import { GoogleGenAI, GenerateContentParameters } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateText(prompt: string, thinkMore: boolean): Promise<string> {
    try {
      // FIX: Use the correct GenerateContentParameters type for the request object.
      const request: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
      };

      if (!thinkMore) {
        // For quick responses, disable thinking.
        request.config = {
          thinkingConfig: { thinkingBudget: 0 }
        };
      } 
      // For "think more", we omit the config to let the model use its default, higher-quality thinking process.

      const response = await this.ai.models.generateContent(request);
      return response.text;
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      return `Sorry, I encountered an error: ${errorMessage}`;
    }
  }
}
