import { Injectable } from '@angular/core';
// FIX: Use GenerateContentParameters instead of the deprecated GenerateContentRequest.
import { GoogleGenAI, GenerateContentParameters, Type } from '@google/genai';

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

  async generateResumeKeywords(jobDescription: string, field: 'experience' | 'skills'): Promise<string[]> {
    try {
      const prompt = field === 'experience' 
        ? `Based on the following job description, generate 3-5 concise, action-oriented bullet points for a resume's work experience section. Focus on quantifiable achievements and strong action verbs. Job Description: "${jobDescription}"`
        : `Based on the following job description, suggest a list of 10-15 relevant hard and soft skills. Prioritize keywords found in the description. Job Description: "${jobDescription}"`;

      const request: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
         config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      };

      const response = await this.ai.models.generateContent(request);
      const jsonResponse = JSON.parse(response.text);
      return jsonResponse.suggestions || [];
    } catch (error) {
      console.error('Error generating resume keywords:', error);
      return ["Error: Could not generate suggestions."];
    }
  }

  async analyzeResumeATS(resumeText: string, jobDescription: string): Promise<{ score: number; feedback: string }> {
     try {
      const prompt = `Analyze the following resume against the provided job description from an Applicant Tracking System (ATS) perspective. Provide a score out of 100 representing the match quality. Also, provide concise, actionable feedback for improvement, focusing on keywords, skills, and experience alignment.
      
      Resume:
      ---
      ${resumeText}
      ---

      Job Description:
      ---
      ${jobDescription}
      ---
      `;

      const request: GenerateContentParameters = {
        model: 'gemini-2.5-flash',
        contents: [{ parts: [{ text: prompt }] }],
         config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: 'A score from 0 to 100.' },
              feedback: { type: Type.STRING, description: 'Actionable feedback for the user.'}
            }
          }
        }
      };

      const response = await this.ai.models.generateContent(request);
      return JSON.parse(response.text);
     } catch (error) {
        console.error('Error analyzing resume:', error);
        return { score: 0, feedback: 'An error occurred during analysis. Please try again.' };
     }
  }
}
